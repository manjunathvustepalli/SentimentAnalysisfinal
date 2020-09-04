import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import SemiDonutChart from '../charts/SemiDonutChart'
import Axios from 'axios';
import PieChart from '../charts/PieChart';

const useStyles = makeStyles((theme) => ({
    main: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#CB0038",
    },
    formControl: {
      margin: theme.spacing(1),
      width:'90%',
      borderBottom:'2px solid white'
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
    const [source, setSource] = useState('twitter')
    const [sourceData, setSourceData] = useState([])
    const [mainSourceData, setMainSourceData] = useState([])

    const handleChange = (value) => {
        setSource(value)
        console.log(sourceData,mainSourceData)
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
    }

    var colors = {
        'joy':'rgba(0,255,0,0.5)',
        'sad':'rgba(236, 240, 22,0.5)',
        'anger':'rgba(240, 22, 37,0.5)',
        'anticipation':'rgba(29, 180, 240,0.5)',
        'disgust':'rgba(226, 29, 240,0.5)',
        'surprise':'rgba(240, 124, 29,0.5)',
        'fear':'rgba(0, 0, 0,0.5)',
        'trust':'rgba(217, 202, 202,0.5)',
        'positive':'rgba(0,255,0,0.5)',
        'negative':'rgba(255,0,0,0.5)',
        'neutral':'rgba(235,255,0,0.5)'}

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
                  "Sentiment": {
                    "terms": {
                      "field": "predictedSentiment.keyword"
                    }
                  },
                  "Mood": {
                    "terms": {
                      "field": "predictedMood.keyword"
                    }
                  },
                  "Source": {
                    "terms": {
                      "field": "Source.keyword"
                    }
                  }
                }
              }
            }
          })
          .then(res => {
              setSentiments(res.data.aggregations['date-based-range'].buckets[0].Sentiment.buckets.map(doc => {return{name:doc.key,y:doc.doc_count,color:colors[doc.key]}}))
              setMoods(res.data.aggregations['date-based-range'].buckets[0].Mood.buckets.map(doc => {return{name:doc.key,y:doc.doc_count,color:colors[doc.key]}}))
              setSources(res.data.aggregations['date-based-range'].buckets[0].Source.buckets.map(doc =>doc.key))
              setSourceData(res.data.aggregations['date-based-range'].buckets[0].Source.buckets.map(doc =>{return {[doc['key']]:doc.doc_count}}))
              let obj = []
        let sum = 0
        res.data.aggregations['date-based-range'].buckets[0].Source.buckets.map(doc =>{return {[doc['key']]:doc.doc_count}}).forEach(source => {
            if(Object.keys(source)[0] !== 'twitter'){
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
          })
    }, [from,to])

    return (
        <Card className={classes.main}>
        <CardContent >Overall Analysis</CardContent>
        <Grid container spacing={0} className={classes.gridposition}>
            <Grid item xs={3}>
            <FormControl className={classes.formControl} style={{margin:'30px'}} >
                <InputLabel id="demo-simple-select-helper-label">Source</InputLabel>
                    <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={source}
                    onChange={(e) => handleChange(e.target.value)}
                    >
                        {
                            sources.map((source,i) => <MenuItem value={source}>{source}</MenuItem> )
                        }
                    </Select>
                </FormControl>
                <Card style={{backgroundColor:'black',color:'white'}} align='center'>
                    <Typography variant='subtitle1' >
                        40K+ Twitter mentions
                    </Typography>
                    <Typography variant='subtitle1'>
                        40+ positive sentiment
                    </Typography>
                    <Typography variant='subtitle1'>
                        35+ Positive mood
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
