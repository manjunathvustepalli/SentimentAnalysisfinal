import React, { useEffect, useState } from 'react'
import TrendAnalysisLineChart from '../charts/TrendAnalysisLineChart'
import Axios from 'axios'
import colors from '../../helpers/colors'
import { Link } from 'react-router-dom'

function MoodAnalysis({ toFromDateHandlers, keywords, keywordType, refresh}) {

    const [ from,to ] = toFromDateHandlers
    const [data, setData] = useState([])
    const [dates, setDates] = useState([])

    useEffect(() => {
      setData([])
      setDates([])
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
         moods.forEach((mood,i) => {
             sortedData.push({
                 name:mood,
                 color:colors[mood],
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
    }, [from,to,keywords,keywordType,refresh])

    return (
      <Link to="/mood-analysis/line-chart" style={{width:'100%'}} >
        <div>
            <TrendAnalysisLineChart title="Date wise Mood Trend" dates={dates} data={data} />
        </div>
      </Link>
    )
}

export default MoodAnalysis
