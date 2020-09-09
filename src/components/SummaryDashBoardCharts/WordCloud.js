import React, { useEffect, useState } from 'react'
import { Grid, CardContent, makeStyles, InputLabel, Select, MenuItem } from '@material-ui/core'
import InlineFilter from '../Filters/InlineFilter'
import Axios from 'axios'
import { getKeyArray } from '../../helpers'
import WordCloudChart from '../charts/WordCloudChart'
import { green } from '@material-ui/core/colors'

var sortedData = {}

var colors = {
    'joy':green[800],
    'sad':'rgba(236, 240, 22)',
    'anger':'rgba(240, 22, 37)',
    'anticipation':'rgba(29, 180, 240)',
    'disgust':'rgba(226, 29, 240)',
    'surprise':'rgba(240, 124, 29)',
    'fear':'rgba(0, 0, 0)',
    'trust':'rgba(217, 202, 202)',
    'positive':green[800],
    'negative':'rgba(255,0,0)',
    'neutral':'rgba(235,255,0)'
  }

  const useStyles = makeStyles((theme) => ({
    filterDefault: {
        borderColor: "#43B02A",
        borderStyle: "solid",
        borderWidth: "1px",
        padding: '5px',
        color: "#43B02A",
    },
    filterColorDefault:{
        color: "#43B02A"
    },

}));

function WordCloud(props) {

    const { from,to,keywords,keywordType } = props
    const [sources, setSources] = useState([])
    const [source, setSource] = useState('')
    const [sentiment, setSentiment] = useState('positive')
    const [mood, setMood] = useState('joy')
    const [data, setData] = useState([])
    const [type, setType] = useState('sentiment')
    const classes = useStyles();

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
                        "Source": {
                            "terms": {
                                "field": "Source.keyword"
                            },
                            "aggs": {
                                "Daily-Sentiment-Distro": {
                                    "terms": {
                                        "field": "predictedSentiment.keyword"
                                    },
                                  "aggs":{
                                  	   "Words": {
                                         	"terms": {
                                                "field": "HashtagEntities.Text.keyword"
                                                }
                                            }
                                  }
                                },
                                "Daily-Mood-Distro":{
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
            let sourceBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].Source.buckets
            let sourceKeys = getKeyArray(sourceBuckets)
            setSources(sourceKeys)
            setSource(sourceKeys[0])
            sourceKeys.forEach((source,i) => {
                sortedData[source] = {}
                let sentimentBuckets = sourceBuckets[i]['Daily-Sentiment-Distro'].buckets
                let sentimentKeys = getKeyArray(sentimentBuckets)
                sortedData[source].sentiment = {}
                sentimentKeys.forEach((sentiment,j) => {
                    console.log(sentiment,j)
                    let wordBuckets = sentimentBuckets[j].Words.buckets
                    sortedData[source].sentiment[sentiment] = wordBuckets.map(wordObj => {
                        return {
                            name:wordObj.key,
                            weight:wordObj.doc_count,
                            color:colors[sentiment]
                        }
                    })
                })
                let moodBuckets = sourceBuckets[i]['Daily-Mood-Distro'].buckets
                let moodKeys = getKeyArray(moodBuckets)
                sortedData[source].mood = {}
                moodKeys.forEach((mood,k) =>{
                    let wordBuckets = moodBuckets[k].Words.buckets
                    sortedData[source].mood[mood] = wordBuckets.map(wordObj => {
                        return {
                            name:wordObj.key,
                            weight:wordObj.doc_count,
                            color:colors[mood]
                        }
                    })
                })
            })
            console.log(sortedData)    
        })
        .catch(err => {
            console.log(err)
        })
    },[to,from,keywords,keywordType])

    useEffect(() => {
        setData(prev => {
            try{
                if(type==='sentiment'){
                    return sortedData[source].sentiment[sentiment]
                } else {
                    return sortedData[source].mood[mood]
                }
            } catch {
                return []
            }
        })
        
    },[source,sentiment,mood,type])

    return (
        <Grid container>
            <Grid item xs={5} style={{height:'90px',lineHeight:'90px',padding:'10px 0 0 20px'}}>
                Word Cloud
            </Grid>
            <Grid item xs={7}>
                { sources && sources.length && (
                    <Grid container spacing={1} style={{marginTop:'20px'}}>
                    <Grid item xs={4} >
                        <InputLabel id="select-source" className={classes.filterColorDefault} >Source</InputLabel>
                            <Select
                            labelId="select-source"
                            id="select-source-main"
                            fullWidth
                            className={classes.filterDefault}
                            value = {source}
                            onChange = { (e) => setSource(e.target.value) }
                            >
                                {
                                   sources && sources.length && (sources.map((source,i) => <MenuItem value={source} key={i} >{source}</MenuItem>))
                                }                    
                            </Select>
                    </Grid>
                    <Grid item xs={4}>
                        <InputLabel id="demo-simple-select-helper-label"className={classes.filterColorDefault} >Type </InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            fullWidth
                            value={type}
                            onChange = {(e) => setType(e.target.value)}
                            className={classes.filterDefault}
                        >
                            <MenuItem value={'sentiment'}>Sentiment</MenuItem>
                            <MenuItem value={'mood'}>Mood</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                    {
                        type ==='sentiment' ? (
                            <>
                            <InputLabel id="demo-simple-select-helper-label"className={classes.filterColorDefault} >Sentiment </InputLabel>
                            <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            fullWidth
                            value={sentiment}
                            onChange = {(e) => setSentiment(e.target.value)}
                            className={classes.filterDefault}
                            >
                            <MenuItem value={'negative'}>Negative</MenuItem>
                            <MenuItem value={'positive'}>Positive</MenuItem>
                            <MenuItem value={'neutral'}>Neutral</MenuItem>
                            </Select>
                            </>
                        ) : (
                            <>
                            <InputLabel id="demo-simple-select-helper-label" className={classes.filterColorDefault}>Mood </InputLabel>
                            <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            fullWidth
                            value = {mood}
                            onChange = {(e) => setMood(e.target.value)}
                            className={classes.filterDefault}
                            >
                            <MenuItem value={'joy'}>Joy</MenuItem>
                            <MenuItem value={'anticipation'}>Anticipation</MenuItem>
                            <MenuItem value={'surprise'}>Surprise</MenuItem>
                            <MenuItem value={'anger'}>Anger</MenuItem>
                            <MenuItem value={'trust'}>Trust</MenuItem>
                            <MenuItem value={'fear'}>Fear</MenuItem>
                            <MenuItem value={'sad'}>Sad</MenuItem>
                            <MenuItem value={'disgust'}>Disgust</MenuItem>
        
                            </Select>
                            </>
                        )
                    }                        
                    </Grid>
                </Grid>
                ) }
            </Grid>
            <Grid item xs={12}>
                <WordCloudChart data={data} />
            </Grid>
        </Grid>
    )
}

export default WordCloud