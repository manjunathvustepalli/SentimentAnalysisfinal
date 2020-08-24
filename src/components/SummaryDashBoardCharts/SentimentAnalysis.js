import React, { useEffect, useState } from 'react'
import TrendAnalysisLineChart from '../charts/TrendAnalysisLineChart'
import Axios from 'axios'
import AreaChart from '../charts/AreaChart'

function SentimentAnalysis(props) {

    const [ from,to ] = props.dates
    const [data, setData] = useState([])
    const [dates, setDates] = useState([])

    useEffect(() => {
        Axios.post(process.env.REACT_APP_URL,
            {
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
                },{
             headers:{
                'Content-Type':'application/json'
            }
        })
     .then( fetchedData => {
         let perDayBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0]['per-day'].buckets
         let perDayKeys = perDayBuckets.map(keyObj => keyObj.key_as_string)
         let sortedData = []
         let sentiments = ['positive','negative','neutral']
         let colors = ['rgb(0,255,0)','rgb(255,0,0)','rgb(255,255,0)']

         sentiments.forEach((sentiment,i) => {
             sortedData.push({
                 name:sentiment,
                 color:colors[i],
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
    }, [from,to])

    return (
        <div>
            <AreaChart dates={dates} data={data} sorted={true} />
        </div>
    )
}

export default SentimentAnalysis
