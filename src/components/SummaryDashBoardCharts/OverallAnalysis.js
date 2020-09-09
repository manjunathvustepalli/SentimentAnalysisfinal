import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import SemiDonutChart from '../charts/SemiDonutChart'
import Axios from 'axios';
import PieChart from '../charts/PieChart';
import { getKeyArray } from '../../helpers';

var sortedData =  {}

function nFormatter(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

const useStyles = makeStyles((theme) => ({
    main: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#CB0038",
    },
    formControl: {
      margin: '10px',
      fullWidth: true,
      display: 'flex',
      wrap: 'nowrap'
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    gridposition: {
        position: "relative",
    }
  }));

function OverallAnalysis({to, from}) {
    const classes = useStyles();
    const [sentiments, setSentiments] = useState([])
    const [moods, setMoods] = useState([])
    const [sources, setSources] = useState([])
    const [source, setSource] = useState('')
    const [sourceData, setSourceData] = useState([])
    const [mainSourceData, setMainSourceData] = useState([])

    const getPositiveSentiment =() => {
      let value = ''
      sentiments.forEach(sentimentObj =>{
        if(sentimentObj.name === 'positive'){
          value = sentimentObj.y
        }
      })
      return nFormatter(value,0)
    }

    const getJoyMood = () => {
      let value = ''
      moods.forEach(moodObj =>{
        if(moodObj.name ==='joy'){
          value = moodObj.y
        }
      })
      return nFormatter(value,0)
    }

    const handleChange = (value) => {
        setSource(value)
        let obj = []
        let sum = 0
        sourceData.forEach(source => {
            if(Object.keys(source)[0] !== value){
                sum += source[Object.keys(source)[0]]
            } else {
                obj.push({
                    name:Object.keys(source)[0],
                    y:source[Object.keys(source)[0]]
                })
            }

        })
        obj.push({
            name:'others',
            y:sum
        })
        setMainSourceData(obj)
        setSentiments(sortedData[value].sentiment)
        setMoods(sortedData[value].mood)
    }

    var colors = {
        'joy':'rgba(0,255,0)',
        'sad':'rgba(236, 240, 22)',
        'anger':'rgba(240, 22, 37)',
        'anticipation':'rgba(29, 180, 240)',
        'disgust':'rgba(226, 29, 240)',
        'surprise':'rgba(240, 124, 29)',
        'fear':'rgba(0, 0, 0)',
        'trust':'rgba(217, 202, 202)',
        'positive':'rgba(0,255,0)',
        'negative':'rgba(255,0,0)',
        'neutral':'rgba(235,255,0)'
      }

    useEffect(() => {
        Axios.post(process.env.REACT_APP_URL,{
            "aggs": {
              "date-based-range": {
                "date_range": {
                  "field": "CreatedAt",
                  "time_zone": "+05:30",
                  "format": "dd-MM-yyyy",
                  "ranges": [
                    { "from": from, "to": to}
                  ]
                },
                "aggs": {
                  "Source": {
                    "terms": {
                      "field": "Source.keyword"
                    }
                  },
                  "sources-mood-sentiment":{
                    "terms":{
                      "field":"Source.keyword"
                    },
                    "aggs":{
                      "Sentiment":{
                        "terms":{
                          "field":"predictedSentiment.keyword"
                        }
                      },
                      "Mood": {
                        "terms": {
                          "field": "predictedMood.keyword"
                        }
                      }
                    }
                  }
                }
              }
            }
          })
          .then(res => {
              setSources(res.data.aggregations['date-based-range'].buckets[0].Source.buckets.map(doc =>doc.key))
              setSourceData(res.data.aggregations['date-based-range'].buckets[0].Source.buckets.map(doc =>{return {[doc['key']]:doc.doc_count}}))
              let obj = []
            let sum = 0
            setSource(res.data.aggregations['date-based-range'].buckets[0].Source.buckets[0].key)
          res.data.aggregations['date-based-range'].buckets[0].Source.buckets.map(doc =>{return {[doc['key']]:doc.doc_count}}).forEach(source => {
            if(Object.keys(source)[0] !== res.data.aggregations['date-based-range'].buckets[0].Source.buckets[0].key){
                sum += source[Object.keys(source)[0]]
            } else {
                obj.push({
                    name:Object.keys(source)[0],
                    y:source[Object.keys(source)[0]]
                })
            }

          })
        obj.push({
            name:'others',
            y:sum
        })
        setMainSourceData(obj)
        let sourceBuckets = res.data.aggregations['date-based-range'].buckets[0]['sources-mood-sentiment'].buckets
        let sourceKeys = getKeyArray(sourceBuckets)
        sourceKeys.forEach((source,i) => {
          sortedData[source] = {}
          let moodBuckets = sourceBuckets[i].Mood.buckets
          let sentimentBuckets = sourceBuckets[i].Sentiment.buckets
          sortedData[source].mood = moodBuckets.map(moodObj =>{
            return {
              name:moodObj.key,
              y:moodObj.doc_count,
              color:colors[moodObj.key]
            }
          })
          sortedData[source].sentiment = sentimentBuckets.map(sentimentObj =>{
            return {
              name:sentimentObj.key,
              y:sentimentObj.doc_count,
              color:colors[sentimentObj.key]
            }
          })
        })
        let s = res.data.aggregations['date-based-range'].buckets[0].Source.buckets[0].key
        setSentiments(sortedData[s].sentiment)
        setMoods(sortedData[s].mood)
      })
    }, [from,to])

    return (
        <Card className={classes.main}>
        <CardContent >Overall Analysis</CardContent>
        <Grid container spacing={0} className={classes.gridposition}>
            <Grid item xs={3}>
            <FormControl variant="outlined" className={classes.formControl} style={{margin:'30px'}} >
                <InputLabel id="Source-label">Source</InputLabel>
                    <Select 
                      labelId="Source-label"
                      variant="outlined"
                      id="source"
                      label="Source"
                      value={source}
                      onChange={(e) => handleChange(e.target.value)}
                    >
                        {
                            sources.map((source,i) => <MenuItem key={i} value={source}>{source}</MenuItem> )
                        }
                    </Select>
                </FormControl>
                <Card style={{backgroundColor:'#2F363F',color:'white'}} align='center'>
                    <Typography variant='subtitle1' >
                        {nFormatter(mainSourceData.length && (
                          mainSourceData[0].name === source ? (mainSourceData[0].y) : (mainSourceData[1].y)
                        ),0)}+ &nbsp; {source} mentions
                    </Typography>
                    <Typography variant='subtitle1'>
                        {getPositiveSentiment()}+ &nbsp; positive sentiment
                    </Typography>
                    <Typography variant='subtitle1'>
                        {getJoyMood()}+ Joy mood
                    </Typography>
                </Card>
            </Grid>
            <Grid item xs={3} >
                <SemiDonutChart data={mainSourceData} />
            </Grid>
            <Grid item xs={3}>
                <PieChart  data={sentiments} />
            </Grid>
            <Grid item xs={3}>
                <PieChart data={moods} />
            </Grid>
        </Grid>
    </Card>
    )
}

export default OverallAnalysis
