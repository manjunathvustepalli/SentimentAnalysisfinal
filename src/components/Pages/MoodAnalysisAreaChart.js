import React, { useState, useEffect } from 'react'
import SideNav from '../Navigation/SideNav'
import { Grid, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem, makeStyles } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import FilterHeader from '../Filters/FilterHeader'
import FilterWrapper from '../Filters/FilterWrapper'
import AccordianFilters from '../Filters/AccordianFilters'
import { addMonths, getKeyArray, getDocCountByKey } from '../../helpers'
import Axios from 'axios';
import { MoodAnalysisAreaChartFilter } from '../../helpers/filter';
import AreaChart from '../charts/AreaChart';

const useStyles = makeStyles((theme) => ({
    main: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#CB0038",
    },
    formControl: {
        margin: '20px',
        fullWidth: true,
        display: 'flex',
        wrap: 'nowrap'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    dataDate:{
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginTop:50,
    },
    paper: {
        height: 140,
        width: 130,        
      },
}));
var sortedData = {}

export default function MoodAnalysisAreaChart() {
    var colors = {'joy':'rgba(0,255,0,0.5)','sad':'rgba(236, 240, 22,0.5)','anger':'rgba(240, 22, 37,0.5)','anticipation':'rgba(29, 180, 240,0.5)','disgust':'rgba(226, 29, 240,0.5)','surprise':'rgba(240, 124, 29,0.5)','fear':'rgba(0, 0, 0,0.5)','trust':'rgba(217, 202, 202,0.5)'}
    const classes = useStyles()
    const [refresh, setRefresh] = useState(true)
    const [chartType, setChartType] = useState('area')
    const [sources,setSources] = useState([])
    const [data, setData] = useState({})
    const [languages,setLanguages] = useState([])
    const [moods,setMoods] = useState([])
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const handleChange = (e) => {
        setChartType(e.target.value)
    }

    useEffect(() => {
        Axios.post(process.env.REACT_APP_URL,
        {
            "aggs": {
              "date-based-range": {
                "date_range": {
                  "field": "CreatedAt",
                  "format": "dd-MM-yyyy",
                  "ranges": [
                    { "from": from, "to":to }
                  ]
                },
                "aggs": {
                  "lang": {
                    "terms": {
                      "field": "predictedLang.keyword"
                    },
                    "aggs": {
                      "source": {
                        "terms": {
                          "field": "Source.keyword"
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
                  }
                }
              }
            },{
             headers:{
                'Content-Type':'application/json'
            }
        })
     .then( fetchedData => {
         var sourceKeys
         var uniqueSourceKeys = []
         let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
         var languageKeys = getKeyArray(languageBuckets)
         if(languageKeys[0]){
            languageKeys.forEach((key,i) =>{
                let sourceBuckets = languageBuckets[i].source.buckets
                sourceKeys = getKeyArray(sourceBuckets)
                sortedData[key] ={}
                sourceKeys.forEach((source,j) => {
                   if(!uniqueSourceKeys.includes(source)){
                       uniqueSourceKeys.push(source)
                   } 
                   sortedData[key][source] ={}
                   let perDayBuckets = sourceBuckets[j]['per-day'].buckets
                   let perDayKeys = sourceBuckets[j]['per-day'].buckets.map(item => item.key_as_string)
                   sortedData[key][source]['dates'] = perDayKeys
                   sortedData[key][source]['joy'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'joy'))
                   sortedData[key][source]['anticipation'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'anticipation'))
                   sortedData[key][source]['fear'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'fear'))
                   sortedData[key][source]['disgust'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'disgust'))
                   sortedData[key][source]['sad'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'sad'))
                   sortedData[key][source]['surprise'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'surprise'))
                   sortedData[key][source]['trust'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'trust'))
                   sortedData[key][source]['anger'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'anger'))
               });
            })
            console.log(sortedData)
            uniqueSourceKeys.forEach(source =>{
               setSources(prev => { return {...prev,[source]:true}})
           })
           languageKeys.forEach(lang =>{
               setLanguages(prev => {return {...prev,[lang]:true}})
           })
           setMoods({'joy':true,'anticipation':true,'fear':true,'disgust':true,'sad':true,'surprise':true,'trust':true,'anger':true})   
         } else {
             setSources({})
             setLanguages({})
             setMoods({})
             sortedData = {}
         }
             })
     .catch(err => {
         console.log(err)
     })
     }, [from,to,refresh])
 
     useEffect(() => {
        let finalData = MoodAnalysisAreaChartFilter(languages,moods,sources,sortedData,from,to)
            setData(finalData)
    }, [languages,moods,sources,to,from])

    return (
        <SideNav>
            <div style={{ backgroundColor: '#F7F7F7' }}>
            {chartType === 'pie' && <Redirect to='/mood-analysis/pie-chart' />}
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px'}}>
                        Mood Analysis
                    </Typography>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item sm={8}>
                                <CardContent>
                                    Mood Wise Trend
                                </CardContent>
                            </Grid>
                            <Grid item sm={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Change Chart Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={chartType}
                                onChange={handleChange}
                                label="Chart Type"
                            >
                                <MenuItem value='pie'>pie chart</MenuItem>
                                <MenuItem value='area'>Area chart</MenuItem>
                            </Select>
                            </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <AreaChart data={data} colors={colors} />
                        </Grid>
                    </Card>
                </Grid>
                <Grid item sm={12} md={4}  >
                    <Grid container spacing={3} >
                        <Grid item xs={12} >
                            <FilterHeader refresh={[refresh,setRefresh]} />
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters 
                                    toFromDatesHandlers={[setFrom,setTo,addMonths]} 
                                    sources={[sources,setSources]} 
                                    languages={[languages,setLanguages]} 
                                    moods={[moods,setMoods]} 
                                />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>       
        </SideNav>
    )
}
