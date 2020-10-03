import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import AreaChart from '../charts/AreaChart'
import colors from '../../helpers/colors'

function SentimentAnalysis({toFromDateHandlers,keywords,keywordType,refresh}) {

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
                { "from": from,"to": to}
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
                        "field": "predictedSentiment.keyword"
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
         let sentiments = ['positive','negative','neutral']
    
         sentiments.forEach((sentiment,i) => {
             sortedData.push({
                 name:sentiment,
                 color:colors[sentiment],
                 data:perDayBuckets.map(day => {
                     let sentiBuckets = day['Daily-Sentiment-Distro'].buckets
                     for(var j=0;j<sentiBuckets.length;j++){
                         if(sentiBuckets[j].key === sentiment){
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
    }, [from,to,keywords,keywordType,refresh])

    return (
        <div>
            <AreaChart title="Date wise Sentiment Trend" dates={dates} data={data} sorted={true} />
        </div>
    )
}

export default SentimentAnalysis
