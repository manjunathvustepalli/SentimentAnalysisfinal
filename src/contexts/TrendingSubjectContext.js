import React,{ useState,createContext, useEffect } from 'react'
import { addMonths, getKeyArray } from '../helpers'
import Axios from 'axios'
import useDidUpdateEffect from '../components/custom Hooks/useDidUpdateEffect'
import {Auth} from '../components/Pages/Auth'

var sortedData = {}

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
    const [sentiments, setSentiments] = useState([]);
    const [keywords, setKeywords] = useState([])
    const [keywordType, setKeywordType] = useState('Entire Data')
    const [refresh, setRefresh] = useState(true);
    const [moodData, setMoodData] = useState([])
    const [sentimentData, setSentimentData] = useState([])

    useEffect(()=>{
        setMoodData([])
        setSentimentData([])
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
                                                },
                                                "Daily-Sentiment-Distro": {
                                                  "terms": {
                                                    "field": "predictedSentiment.keyword"
                                                  },
                                                      "aggs":{
                                                        "Words":{
                                                          "terms":{
                                                            "field":"HashtagEntities.Text.keyword"
                                                          }
                                                      }
                                                  }
                                              }
                                            },
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
          Axios.post(process.env.REACT_APP_URL,query, Auth)
        .then(fetchedData => {
          let selectedLanguage, selectedSource, selectedSubSource, selectedMood, selectedSentiment
          let gotAllData = false
          let allMoods = ['joy','sad','anger','anticipation','disgust','surprise','fear','trust']
          let allSentiments = ['positive','negative','neutral']
          let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
          let languageKeys = getKeyArray(languageBuckets)
          languageKeys.forEach((language,i) => {
            sortedData[language] = {}
            let sourceBuckets = languageBuckets[i].Source.buckets
            let sourceKeys = getKeyArray(sourceBuckets)
            sourceKeys.forEach((source,j) =>{
              sortedData[language][source] = {}
              let subSourceBuckets = sourceBuckets[j].SubSource.buckets
              let subSourceKeys = getKeyArray(subSourceBuckets)
              subSourceKeys.forEach((subSource,k) => {
                sortedData[language][source][subSource] = {}
                sortedData[language][source][subSource].mood = {}
                sortedData[language][source][subSource].sentiment = {}
                let sentimentBuckets = subSourceBuckets[k]['Daily-Sentiment-Distro'].buckets
                let sentimentKeys = getKeyArray(sentimentBuckets)
                sentimentKeys.forEach((sentiment,l)=>{
                    sortedData[language][source][subSource].sentiment[sentiment] = sentimentBuckets[l].Words.buckets.map(wordObj => {
                        return {
                          name:wordObj.key,
                          y:wordObj.doc_count
                        }
                      })

                })
                let moodBuckets = subSourceBuckets[k]['Daily-mood-Distro'].buckets
                let moodKeys = getKeyArray(moodBuckets)
                moodKeys.forEach((mood,l)=>{
                    sortedData[language][source][subSource].mood[mood] = moodBuckets[l].Words.buckets.map(wordObj => {
                        return {
                          name:wordObj.key,
                          y:wordObj.doc_count
                        }
                      }) 
                    })
                    if(!gotAllData){
                    allMoods.forEach(mood => {
                      allSentiments.forEach(sentiment =>{
                        if(sortedData[language][source][subSource].mood[mood] && sortedData[language][source][subSource].sentiment[sentiment] && !!sortedData[language][source][subSource].mood[mood].length && !!sortedData[language][source][subSource].sentiment[sentiment].length && !gotAllData){
                          gotAllData = true
                          selectedLanguage = language
                          selectedSource =  source
                          selectedSubSource = subSource
                          selectedMood = mood
                          selectedSentiment = sentiment
                        }
                      })
                    })}
                  })
                })
              })
          setLanguages(languageKeys)
          setLanguage(selectedLanguage)
          setSources(Object.keys(sortedData[selectedLanguage]))
          setSource(selectedSource)
          setSubSources(Object.keys(sortedData[selectedLanguage][selectedSource]))
          setSubSource(selectedSubSource)
          setMoods(Object.keys(sortedData[selectedLanguage][selectedSource][selectedSubSource].mood))    
          setSentiments(Object.keys(sortedData[selectedLanguage][selectedSource][selectedSubSource].sentiment))
          setmood(selectedMood)
          setSentiment(selectedSentiment)
          setMoodData(sortedData[selectedLanguage][selectedSource][selectedSubSource].mood[selectedMood])
          setSentimentData(sortedData[selectedLanguage][selectedSource][selectedSubSource].sentiment[selectedSentiment])
        })
        .catch(err=>{
          console.log(err,err.response)
        })        
    },[keywords,keywordType,from,to,refresh])

    const changeData = (type,value) => {
      if(type === 'language'){
        let selectedSource,selectedSubSource
        setSources(Object.keys(sortedData[value]))
        selectedSource = Object.keys(sortedData[value])[0]
        setSource(selectedSource)
        setSubSources(Object.keys(sortedData[value][selectedSource]))
        selectedSubSource = Object.keys(sortedData[value][selectedSource])[0] 
        setSubSource(selectedSubSource)  
        let tempMoods = Object.keys(sortedData[value][selectedSource][selectedSubSource].mood)
        let tempSentiments = Object.keys(sortedData[value][selectedSource][selectedSubSource].sentiment)
        setMoods(tempMoods) 
        setSentiments(tempSentiments)
        setmood(tempMoods[0])
        setSentiment(tempSentiments[0])
        setMoodData(sortedData[value][selectedSource][selectedSubSource].mood[tempMoods[0]])
        setSentimentData(sortedData[value][selectedSource][selectedSubSource].sentiment[tempSentiments[0]])  
      } 
      
      else if(type === 'source'){
        setSubSources(Object.keys(sortedData[language][value]))
        let selectedSubSource = Object.keys(sortedData[language][value])[0] 
        setSubSource(selectedSubSource)
        if(selectedSubSource){
          let tempMoods = Object.keys(sortedData[language][value][selectedSubSource].mood)
          let tempSentiments = Object.keys(sortedData[language][value][selectedSubSource].sentiment)
          setMoods(tempMoods) 
          setSentiments(tempSentiments)
          setmood(tempMoods[0])
          setSentiment(tempSentiments[0])
          setMoodData(sortedData[language][value][selectedSubSource].mood[tempMoods[0]])
          setSentimentData(sortedData[language][value][selectedSubSource].sentiment[tempSentiments[0]])  
        } else {
          setMoodData([])
          setSentimentData([])
        }
      } 
      
      else if(type === 'subSource'){
        let tempMoods = Object.keys(sortedData[language][source][value].mood)
        let tempSentiments = Object.keys(sortedData[language][source][value].sentiment)
        setMoods(tempMoods) 
        setSentiments(tempSentiments)
        setmood(tempMoods[0])
        setSentiment(tempSentiments[0])
        setMoodData(sortedData[language][source][value].mood[tempMoods[0]])
        setSentimentData(sortedData[language][source][value].sentiment[tempSentiments[0]])
      } 
      
      else if(type === 'mood' || type === 'sentiment'){
        if(['positive','negative','neutral'].includes(value)){
          setSentimentData(sortedData[language][source][subSource].sentiment[value])
        } else {
          setMoodData(sortedData[language][source][subSource].mood[value])
        }
      }
    }

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
      setKeywordType,
      refresh, 
      setRefresh,
      moodData, 
      setMoodData,
      sentimentData,
      setSentimentData,
      changeData
  }

    return (
        <TrendingSubjectFiltersContext.Provider value={TrendingSubjectFilters} >
            { children }
        </TrendingSubjectFiltersContext.Provider>
    )
}