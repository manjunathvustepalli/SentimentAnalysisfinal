import React,{ useState,createContext, useEffect } from 'react'
import { addMonths, getKeyArray } from '../helpers'
import Axios from 'axios'

export const TrendingSubjectFiltersContext = createContext()
export const TrendingSubjectContext = ({ children }) => {
    const [sources, setSources] = useState([]);
    const [source, setSource] = useState('');
    const [subSources,setSubSources] = useState([]);
    const [subSource, setSubSource] = useState('');
    const [languages, setLanguages] = useState([]);
    const [language, setLanguage] = useState('');
    const [from, setFrom] = useState(addMonths(new Date(), -1));
    const [to, setTo] = useState(addMonths(new Date(), 0));
    const [moods, setMoods] = useState([])
    const [mood, setmood] = useState('joy');
    const [sentiment, setSentiment] = useState('positive');
    const [sentiments, setSentiments] = useState(['positive','negative','neutral']);
    const [keywords, setKeywords] = useState([])
    const [keywordType, setKeywordType] = useState('Entire Data')
  
    let TrendingSubjectFilters = {
        sources, 
        setSources,
        source, 
        setSource,
        subSources,
        setSubSources,
        subSource, 
        setSubSource,
        sentiment,
        setSentiment,
        sentiments,
        setSentiments,
        languages, 
        setLanguages,
        language, 
        setLanguage,
        from, 
        setFrom,
        to,
        setTo,
        moods,
        setMoods,
        mood,
        setmood,
        keywords,
        setKeywords,
        keywordType,
        setKeywordType
    }
    let sortedData = {}

    useEffect(()=>{
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
                                                "Daily-mood-Distro": {
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
        .then(fetchedData => {
          let uniqueSources = []
          let uniqueSubSources = []
          let uniqueMoodKeys = []
          let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
          let languageKeys = getKeyArray(languageBuckets)
          languageKeys.forEach((language,i) => {
            sortedData[language] = {}
            let sourceBuckets = languageBuckets[i].Source.buckets
            let sourceKeys = getKeyArray(sourceBuckets)
            sourceKeys.forEach((source,j) =>{
              if(!uniqueSources.includes(source)){
                uniqueSources.push(source)
              }
              sortedData[language][source] = {}
              let subSourceBuckets = sourceBuckets[j].SubSource.buckets
              let subSourceKeys = getKeyArray(subSourceBuckets)
              subSourceKeys.forEach((subSource,k) => {
                if(!uniqueSubSources.includes(subSource)){
                  uniqueSubSources.push(subSource)
                }
                sortedData[language][source][subSource] = {}
                let moodBuckets = subSourceBuckets[k]['Daily-mood-Distro'].buckets
                let moodKeys = getKeyArray(moodBuckets)
                moodKeys.forEach((mood,l)=>{
                    if(!uniqueMoodKeys.includes(mood)){
                      uniqueMoodKeys.push(mood)
                    }
                    sortedData[language][source][subSource][mood] = moodBuckets[l].Words.buckets.map(wordObj => {
                        return {
                          name:wordObj.key,
                          y:wordObj.doc_count
                        }
                      }) 
                })
              })
            })
          })
          setLanguages(languageKeys)
          setLanguage(languageKeys[0])
          setSources(uniqueSources)
          setSource(uniqueSources[0])
          setSubSources(Object.keys(sortedData[languageKeys[0]][uniqueSources[0]]))
          setSubSource(Object.keys(sortedData[languageKeys[0]][uniqueSources[0]])[0])
          setMoods(uniqueMoodKeys)
          setmood(uniqueMoodKeys[0])
        })
        .catch(err=>{
          console.log(err)
        })        
    },[])

    return (
        <TrendingSubjectFiltersContext.Provider value={TrendingSubjectFilters} >
            { children }
        </TrendingSubjectFiltersContext.Provider>
    )
}