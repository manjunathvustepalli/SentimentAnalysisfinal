import React,{ useState,createContext, useEffect } from 'react'
import { addMonths, getKeyArray } from '../helpers'
import Axios from 'axios'
 import {Auth} from '../components/Pages/Auth'
export const SentimentAnalysisFiltersContext = createContext()

export const SentimentAnalysisContext = ({ children }) => {

    const [keywords, setKeywords] = useState([])
    const [keywordType, setKeywordType] = useState('Entire Data')
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const [sources,setSources] = useState([])
    const [subSources,setSubSources] = useState([])
    const [languages,setLanguages] = useState([])
    const [sentiments,setSentiments] = useState([])

    let sentimentFilters = {
        keywords,
        setKeywords,
        keywordType, 
        setKeywordType,
        from,
        setFrom,
        to,
        setTo,
        sources,
        setSources,
        subSources,
        setSubSources,
        languages,
        setLanguages,
        sentiments,
        setSentiments
    }

    useEffect(() => {
        let query = {
            "aggs": {
              "date-based-range": {
                "date_range": {
                  "field": "CreatedAt",
                  "format": "dd-MM-yyyy",
                  "ranges": [
                    { "from": from,"to": to}
                  ]
                },
                "aggs": {
                  "lang": {
                    "terms": {
                      "field": "predictedLang.keyword"
                    },
                    "aggs": {
                      "Source": {
                        "terms": {
                          "field": "Source.keyword"
                        },
                        "aggs":{
                            "SubSource":{
                                "terms":{
                                    "field": "SubSource.keyword"
                                },
                            
    
                            "aggs": {
                                "per-day": {
                                  "date_histogram": {
                                      "field": "CreatedAt",
                                      "format": "yyyy-MM-dd", 
                                      "calendar_interval": "day"
                                  },
                                "aggs": {
                                  "Daily-Sentiment-Distro": {
                                    "terms": {
                                      "field": "predictedSentiment.keyword"
                                    }
                                  }
                                }
                                }
                            }
                          }
                        }
                        }
                      }
                    }
                  }
                }
              }
            }
       Axios.post(process.env.REACT_APP_URL,
        query,Auth)
    .then(fetchedData => {
        var sourceKeys,subSourceKeys
        var uniqueSourceKeys = []
        var uniqueSubSourceKeys = []
        let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
        var languageKeys = getKeyArray(languageBuckets)
        if(languageKeys[0]){
            languageKeys.forEach((key,i) =>{
                let sourceBuckets = languageBuckets[i].Source.buckets
                sourceKeys = getKeyArray(sourceBuckets)
                sourceKeys.forEach((source,j) => {
                    if(!uniqueSourceKeys.includes(source)){
                        uniqueSourceKeys.push(source)
                    }
                    let subSourceBuckets = sourceBuckets[j].SubSource.buckets
                    subSourceKeys = getKeyArray(subSourceBuckets)
                    subSourceKeys.forEach((subSource,k) => {
                        if(!uniqueSubSourceKeys.includes(subSource)){
                            uniqueSubSourceKeys.push(subSource)
                        }
                    })
                });
            })
            let availableSourceKeys = {}
            uniqueSourceKeys.forEach(source =>{
                availableSourceKeys[source] = true
            })
            setSources(availableSourceKeys)

            let availableLanguageKeys = {}
            languageKeys.forEach(lang =>{
                availableLanguageKeys[lang] = true
            })
            setLanguages(availableLanguageKeys)

            let availableSubSourceKeys = {}
            uniqueSubSourceKeys.forEach(subSource =>{
                availableSubSourceKeys[subSource]  = true
            })
            setSubSources(availableSubSourceKeys)

            setSentiments(prev => {
                if(Object.keys(prev).length){
                    return prev
                } else {
                    return {negative:true,positive:true,neutral:true}
                }
            })
        } else {
            setSources({})
            setSubSources({})
            setLanguages({})
            setSentiments({})
        }
        
    })
    .catch(err => {
        console.log(err)
    })
    }, [])


    return (
        <SentimentAnalysisFiltersContext.Provider value={sentimentFilters} >
            {children}
        </SentimentAnalysisFiltersContext.Provider>
    )
}