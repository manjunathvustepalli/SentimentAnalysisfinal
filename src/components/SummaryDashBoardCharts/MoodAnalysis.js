import React, { useEffect, useState } from 'react'
import TrendAnalysisLineChart from '../charts/TrendAnalysisLineChart'
import Axios from 'axios'

function MoodAnalysis({toFromDateHandlers,keywords,keywordType}) {

    const [ from,to ] = toFromDateHandlers
    const [data, setData] = useState([])
    const [dates, setDates] = useState([])

    useEffect(() => {
      let query = {
        "aggs": {
          "date-based-range": {
            "date_range": {
              "field": "CreatedAt",
              "format": "dd-MM-yyyy",
              "ranges": [
                { "from": from,"to": to }
              ]
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
                      "field": "predictedMood.keyword"
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
        Axios.post(process.env.REACT_APP_URL,
            query,{
             headers:{
                'Content-Type':'application/json'
            }
        })
     .then( fetchedData => {

         let perDayBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0]['per-day'].buckets
         let perDayKeys = perDayBuckets.map(keyObj => keyObj.key_as_string)
         let sortedData = []
         let moods = ['joy','anticipation','surprise','anger','disgust','fear','sad','trust']
         let colors = ['rgb(17, 237, 24)','rgb(46, 190, 230)','rgb(237, 147, 74)','rgb(217, 30, 52)','rgb(237, 74, 204)','rgb(0,0,0)','rgb(237, 226, 74)','rgb(181, 180, 163)']

         moods.forEach((mood,i) => {
             sortedData.push({
                 name:mood,
                 color:colors[i],
                 data:perDayBuckets.map(day => {
                     let sentiBuckets = day['Daily-Sentiment-Distro'].buckets
                     for(var j=0;j<sentiBuckets.length;j++){
                         if(sentiBuckets[j].key === mood){
                            return sentiBuckets[j].doc_count
                         }
                     }
                     return 0
                 })
             })
         })
         setData(sortedData)
         setDates(perDayKeys)
     })
     .catch(err =>{
       console.log(err.response)
     })
    }, [from,to,keywords,keywordType])

    return (
        <div>
            <TrendAnalysisLineChart dates={dates} data={data} />
        </div>
    )
}

export default MoodAnalysis
