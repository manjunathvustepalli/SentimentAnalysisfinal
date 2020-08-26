import React, { useEffect, useState } from 'react'
import { Grid, CardContent } from '@material-ui/core'
import InlineFilter from '../Filters/InlineFilter'
import Axios from 'axios'
import { getKeyArray } from '../../helpers'
import WordCloudChart from '../charts/WordCloudChart'

var sortedData = {}

function WordCloud(props) {

    const { from,to } = props
    const [sources, setSources] = useState([])
    const [source, setSource] = useState('')
    const [sentiment, setSentiment] = useState('positive')
    const [mood, setMood] = useState('joy')
    const [data, setData] = useState([])

    useEffect(()=>{
        Axios.post(process.env.REACT_APP_URL,{
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
                        "Source": {
                            "terms": {
                                "field": "Source.keyword"
                            },
                            "aggs": {
                                "Daily-Sentiment-Distro": {
                                    "terms": {
                                        "field": "predictedSentiment.keyword"
                                    },
                                    "aggs": {
                                        "Daily-Mood-Distro": {
                                            "terms": {
                                                "field": "predictedMood.keyword"
                                            },
                                            "aggs": {
                                                "Words": {
                                                    "terms": {
                                                        "field": "HashtagEntities.Text.keyword"
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
        })
        .then(fetchedData => {
            let sourceBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].Source.buckets
            let sourceKeys = getKeyArray(sourceBuckets)
            setSources(sourceKeys)
            setSource(sourceKeys[0])
            sourceKeys.forEach((source,i) => {
                sortedData[source] = {}
                let sentimentBuckets = sourceBuckets[i]['Daily-Sentiment-Distro'].buckets
                let sentimentKeys = getKeyArray(sentimentBuckets)
                sentimentKeys.forEach((sentiment,j) => {
                    sortedData[source][sentiment] = {}
                    let moodBuckets = sentimentBuckets[j]['Daily-Mood-Distro'].buckets
                    let moodKeys = getKeyArray(moodBuckets)
                    moodKeys.forEach((mood,k)=>{
                        sortedData[source][sentiment][mood] = moodBuckets[k].Words.buckets.map((wordObj) => {
                            if(mood === 'joy'){
                                return {
                                    name:wordObj.key,
                                    weight:wordObj.doc_count,
                                    color:'rgb(17, 237, 24)'
                                }
                            } else if(mood === 'anticipation'){
                                return {
                                    name:wordObj.key,
                                    weight:wordObj.doc_count,
                                    color:'rgb(46, 190, 230)'
                                }
                            }else if(mood === 'surprise'){
                                return {
                                    name:wordObj.key,
                                    weight:wordObj.doc_count,
                                    color:'rgb(237, 147, 74)'
                                }
                            }else if(mood === 'disgust'){
                                return {
                                    name:wordObj.key,
                                    weight:wordObj.doc_count,
                                    color:'rgb(237, 74, 204)'
                                }
                            }else if(mood === 'sad'){
                                return {
                                    name:wordObj.key,
                                    weight:wordObj.doc_count,
                                    color:'rgb(237, 226, 74)'
                                }
                            }else if(mood === 'fear'){
                                return {
                                    name:wordObj.key,
                                    weight:wordObj.doc_count,
                                    color:'rgb(0,0,0)'
                                }
                            }else if(mood === 'trust'){
                                return {
                                    name:wordObj.key,
                                    weight:wordObj.doc_count,
                                    color:'rgb(181, 180, 163)'
                                }
                            }else if(mood === 'anger'){
                                return {
                                    name:wordObj.key,
                                    weight:wordObj.doc_count,
                                    color:'rgb(217, 30, 52)'
                                }
                            }
                        })
                    })
                })
            })    
            console.log(sortedData)
        })
        .catch(err => {
            console.log(err)
        })
    },[to,from])

    useEffect(() => {
        setData(prev => {
            if(Object.keys(sortedData).length){
                if(sortedData[source]){
                    if(sortedData[source][sentiment]){
                        if(sortedData[source][sentiment][mood]){
                            return sortedData[source][sentiment][mood]
                        } else {
                            return []
                        }
                    } else {
                        return []
                    }
                } else {
                    return []
                }
            } else {
                return []
            }
        })
        
    },[source,sentiment,mood])

    return (
        <Grid container>
            <Grid item xs={5}>
                <CardContent >Word Cloud</CardContent>
            </Grid>
            <Grid item xs={7}>
                { sources && sources.length && (<InlineFilter 
                                                    source={source} 
                                                    sources={sources} 
                                                    setSource={setSource} 
                                                    mood={mood} 
                                                    setMood={setMood} 
                                                    sentiment={sentiment} 
                                                    setSentiment={setSentiment} 
                                                    />) }
            </Grid>
            <Grid item xs={12}>
                <WordCloudChart data={data} />
            </Grid>
        </Grid>
    )
}

export default WordCloud