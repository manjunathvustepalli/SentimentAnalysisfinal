import React, { useEffect, useState } from 'react'
import { Grid, makeStyles, InputLabel, Select, MenuItem, FormControl } from '@material-ui/core'
import Axios from 'axios'
import { capitalizeString, getKeyArray } from '../../helpers'
import WordCloudChart from '../charts/WordCloudChart'

var sortedData = {}

var colors = {
    'joy':'#4C7A00',
    'sad':'#D8D8D8',
    'anger':'#FF5151',
    'anticipation':'#111D31',
    'disgust':'#D512CF',
    'surprise':'#FF6600',
    'fear':'#2000FF',
    'trust':'#0099FF',
    'positive':'#04E46C',
    'negative':'#CB0038',
    'neutral':'#FFC400'
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
    const [source, setSource] = useState('.')
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
        <Grid container spacing={3}>
            <Grid item xs={3} style={{height:'70px',lineHeight:'70px',padding:'10px 0 0 20px'}}>
                Word Cloud
            </Grid>
            <Grid item xs={9}>
                { sources && sources.length && (
                    <Grid container spacing={2} style={{marginTop:'10px'}}>
                    <Grid item xs={4} >
                        <FormControl variant="outlined" style={{width:'100%'}}>
                            <InputLabel id="select-source"  >Source</InputLabel>
                            <Select
                            labelId="select-source"
                            id="select-source-main"
                            variant="outlined"
                            label="Source"
                            fullWidth
                            value = {source}
                            onChange = { (e) => setSource(e.target.value) }
                            >
                                {
                                   sources && sources.length && (sources.map((source,i) => <MenuItem value={source} key={i} >{source}</MenuItem>))
                                }                    
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" style={{width:'100%'}} >
                        <InputLabel id="Select-type" >Type </InputLabel>
                        <Select
                            labelId="Select-type"
                            id="select-type-main"
                            fullWidth
                            label="Type"
                            variant="outlined"
                            value={type}
                            onChange = {(e) => setType(e.target.value)}
                        >
                            <MenuItem value={'sentiment'}>Sentiment</MenuItem>
                            <MenuItem value={'mood'}>Mood</MenuItem>
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                    {
                        type ==='sentiment' ? (
                            <FormControl variant="outlined" style={{width:'90%'}} >
                                <InputLabel id="sentiment-select" >Sentiment </InputLabel>
                                <Select
                                    labelId="sentiment-select"
                                    id="sentiment-select-main"
                                    fullWidth
                                    label="Sentiment"
                                    value={sentiment}
                                    onChange = {(e) => setSentiment(e.target.value)}
                                >
                                    <MenuItem value={'negative'}>Negative</MenuItem>
                                    <MenuItem value={'positive'}>Positive</MenuItem>
                                    <MenuItem value={'neutral'}>Neutral</MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <FormControl variant="outlined" style={{width:'90%'}}>
                                <InputLabel id="select-mood" >Mood </InputLabel>
                                <Select
                                    labelId="select-mood"
                                    id="select-mood-main"
                                    fullWidth
                                    label="Mood"
                                    value = {mood}
                                    onChange = {(e) => setMood(e.target.value)}
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
                            </FormControl>
                        )
                    }                        
                    </Grid>
                </Grid>
                ) }
            </Grid>
            <Grid item xs={12}>
                <WordCloudChart title={`${capitalizeString(source)}  ${type==='sentiment' ? capitalizeString(sentiment) : capitalizeString(mood)} ${ capitalizeString(type)} Word Cloud`} data={data} />
            </Grid>
        </Grid>
    )
}

export default WordCloud