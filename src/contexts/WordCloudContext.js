import React,{ useState,createContext, useEffect } from 'react'
import { addMonths, getKeyArray } from '../helpers'
import Axios from 'axios'

export const WordCloudFiltersContext = createContext()

export const WordCloudContext = ({ children }) => {

    const [keywords, setKeywords] = useState([])
    const [keywordType, setKeywordType] = useState('Entire Data')
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const [sources,setSources] = useState([])
    const [moods,setMoods] = useState([])
    const [sentiments,setSentiments] = useState([])
    const [subSources,setSubSources] = useState([])
    const [wordCount, setWordCount] = useState(30)
    const [value, setValue] = useState(0);


    let wordCloudFilters = {
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
        sentiments,
        setSentiments,
        moods,
        setMoods,
        wordCount,
        setWordCount,
        value,
        setValue
    }

    useEffect( () => {
        let query = {
            "aggs": {
                "date-based-range": {
                    "date_range": {
                        "field": "CreatedAt",
                        "format": "dd-MM-yyyy",
                        "ranges": [{
                            "from": from,
                            "to": to
                        }]
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
                                                "field":"SubSource.keyword"
                                            },
                                            "aggs":{
                                                "Daily-Sentiment-Distro": {
                                                    "terms": {
                                                      "field": "predictedMood.keyword"
                                                    },
                                                    "aggs":{
                                                        "Words":{
                                                            "terms":{
                                                                "field":"HashtagEntities.Text.keyword"
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
        if(keywordType === 'Screen Name'){
            query["query"] = {
                "terms": {
                  "User.ScreenName.keyword": keywords
                }
              }
        } else if (keywordType === 'Hash Tags') {
            query["query"] =  {
                "terms": {
                  "HashtagEntities.Text.keyword": keywords
                }
            }
        }
        Axios.post(process.env.REACT_APP_URL,query)
          .then(fetchedData =>{
            var sourceKeys,subSourceKeys
            var uniqueSourceKeys = []
            var uniqueSubSourceKeys = []
            let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
            var languageKeys = getKeyArray(languageBuckets)
            languageKeys.forEach((key,i) => {
                let sourceBuckets = languageBuckets[i].Source.buckets
                sourceKeys = getKeyArray(sourceBuckets)
                sourceKeys.forEach((source,j) => {
                    if(!uniqueSourceKeys.includes(source)){
                        uniqueSourceKeys.push(source)
                    }
                    let subSourceBuckets = sourceBuckets[j].SubSource.buckets
                    subSourceKeys = getKeyArray(subSourceBuckets)
                    subSourceKeys.forEach((subSource,k)=>{
                        if(!uniqueSubSourceKeys.includes(subSource)){
                            uniqueSubSourceKeys.push(subSource)
                        }
                        let moodBuckets = subSourceBuckets[k]['Daily-Sentiment-Distro'].buckets
                    })
                })
            })
            let availableSourceKeys = {}
            uniqueSourceKeys.forEach(source =>{
                availableSourceKeys[source] = true
            })
            setSources(availableSourceKeys)

            let availableSubSourceKeys = {}
            uniqueSubSourceKeys.forEach(subSource =>{
                availableSubSourceKeys[subSource]  = true
            })
            setSubSources(availableSubSourceKeys)

            setMoods(prev =>{
                if(Object.keys(prev).length){
                    return prev
                } else {
                   return {'joy':true,'anticipation':true,'fear':true,'disgust':true,'sad':true,'surprise':true,'trust':true,'anger':true}
                }})
            setSentiments(prev =>{
                if(Object.keys(prev).length){
                    return prev
                } else {
                   return {negative:true,positive:true,neutral:true}
                }
            }) 
          })
          .catch(err => {
              console.log(err)
          })
    },[])

    return (
        <WordCloudFiltersContext.Provider value={wordCloudFilters}>
            { children }
        </WordCloudFiltersContext.Provider>
    )

}