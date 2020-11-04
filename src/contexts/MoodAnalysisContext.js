import React,{ useState,createContext, useEffect } from 'react'
import { addMonths, getKeyArray } from '../helpers'
import Axios from 'axios'
import {Auth,header}from '../components/Pages/Auth'
export const MoodAnalysisFiltersContext = createContext()

export const MoodAnalysisContext = ({ children }) => {

    const [keywords, setKeywords] = useState([])
    const [keywordType, setKeywordType] = useState('Entire Data')
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const [sources,setSources] = useState([])
    const [subSources,setSubSources] = useState([])
    const [languages,setLanguages] = useState([])
    const [moods,setMoods] = useState([])

    let moodFilters = {
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
        moods,
        setMoods
    }
 
    useEffect(() => {
        // let query = {
        //     "aggs": {
        //       "date-based-range": {
        //         "date_range": {
        //           "field": "CreatedAt",
        //           "format": "dd-MM-yyyy",
        //           "ranges": [
        //             { "from": from,"to": to}
        //           ]
        //         },
        //         "aggs": {
        //           "lang": {
        //             "terms": {
        //               "field": "predictedLang.keyword"
        //             },
        //             "aggs": {
        //               "Source": {
        //                 "terms": {
        //                   "field": "Source.keyword"
        //                 },
        //                 "aggs":{
        //                     "SubSource":{
        //                         "terms":{
        //                             "field": "SubSource.keyword"
        //                         },
                            
    
        //                     "aggs": {
        //                         "per-day": {
        //                           "date_histogram": {
        //                               "field": "CreatedAt",
        //                               "format": "yyyy-MM-dd", 
        //                               "calendar_interval": "day"
        //                           },
        //                         "aggs": {
        //                           "Daily-Sentiment-Distro": {
        //                             "terms": {
        //                               "field": "predictedMood.keyword"
        //                             }
        //                           }
        //                         }
        //                         }
        //                     }
        //                   }
        //                 }
        //                 }
        //               }
        //             }
        //           }
        //         }
        //       }
        //     }
        //     if(keywordType === 'Screen Name'){
        //         query["query"] = {
        //             "terms": {
        //               "User.ScreenName.keyword": keywords
        //             }
        //           }
        //     } else if (keywordType === 'Hash Tags') {
        //         query["query"] =  {
        //             "terms": {
        //               "HashtagEntities.Text.keyword": keywords
        //             }
        //         }
        //     }
        // Axios.post(
        //   process.env.REACT_APP_URL,
        //   query,
        //   Auth
        // )
        let data = JSON.stringify({ queryStartDate: from, queryEndDate: to });

        let config = {
          method: "post",
          url: process.env.REACT_APP_URL + "query/moodanalysis",
          headers: header,
          data: data,
        };

        Axios(config)
          .then((fetchedData) => {
            var sourceKeys, subSourceKeys;
            var uniqueSourceKeys = [];
            var uniqueSubSourceKeys = [];
            let languageBuckets =
              fetchedData.data.aggregations["date-based-range"].buckets[0].lang
                .buckets;
            var languageKeys = getKeyArray(languageBuckets);
            if (languageKeys[0]) {
              languageKeys.forEach((key, i) => {
                let sourceBuckets = languageBuckets[i].Source.buckets;
                sourceKeys = getKeyArray(sourceBuckets);
                sourceKeys.forEach((source, j) => {
                  if (!uniqueSourceKeys.includes(source)) {
                    uniqueSourceKeys.push(source);
                  }
                  let subSourceBuckets = sourceBuckets[j].SubSource.buckets;
                  subSourceKeys = getKeyArray(subSourceBuckets);
                  subSourceKeys.forEach((subSource, k) => {
                    if (!uniqueSubSourceKeys.includes(subSource)) {
                      uniqueSubSourceKeys.push(subSource);
                    }
                  });
                });
                let availableSourceKeys = {};
                uniqueSourceKeys.forEach((source) => {
                  availableSourceKeys[source] = true;
                });
                setSources(availableSourceKeys);

                let availableLanguageKeys = {};
                languageKeys.forEach((lang) => {
                  availableLanguageKeys[lang] = true;
                });
                setLanguages(availableLanguageKeys);

                let availableSubSourceKeys = {};
                uniqueSubSourceKeys.forEach((subSource) => {
                  availableSubSourceKeys[subSource] = true;
                });
                setSubSources(availableSubSourceKeys);

                setMoods((prev) => {
                  if (Object.keys(prev).length) {
                    return prev;
                  } else {
                    return {
                      joy: true,
                      anticipation: true,
                      fear: true,
                      disgust: true,
                      sad: true,
                      surprise: true,
                      trust: true,
                      anger: true,
                    };
                  }
                });
              });
            } else {
              setSources({});
              setLanguages({});
              setMoods({});
            }
          })
          .catch((err) => {
            console.log(err);
          });
     }, [])


    return (
        <MoodAnalysisFiltersContext.Provider value={moodFilters}>
            {children}
        </MoodAnalysisFiltersContext.Provider>
    )
}

export default MoodAnalysisContext
