import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AreaChart from '../charts/AreaChart';
import SideNav from '../Navigation/SideNav'
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import FilterHeader from '../Filters/FilterHeader';
import FilterWrapper from '../Filters/FilterWrapper';
import AccordianFilters from '../Filters/AccordianFilters';
import { Typography } from '@material-ui/core';
import { getKeyArray,addMonths, getDocCountByKey } from '../../helpers';
import { sentimentalAnalysisAreaChartFilter } from '../../helpers/filter';

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

export default function SentimentalAnalysisAreaChart() {
    let colors = { 'positive':'rgb(0,255,0,0.5)','negative':'rgba(255,0,0,0.5)','neutral':'rgba(235,255,0,0.5)' } 
    const [chartType, setChartType] = useState('area')
    const [refresh, setRefresh] = useState(true)
    const [data, setData] = useState({})
    const [sources,setSources] = useState([])
    const [subSources,setSubSources] = useState([])
    const [languages,setLanguages] = useState([])
    const [sentiments,setSentiments] = useState([])
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const classes = useStyles();
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
                    { "from": from,"to": to}
                  ]
                },
                "aggs": {
                  "lang": {
                    "terms": {
                      "field": "predictedLang.keyword"
                    },
                    "aggs": {
                      "Source": {
                        "terms": {
                          "field": "Source.keyword"
                        },
                        "aggs":{
                            "SubSource":{
                                "terms":{
                                    "field": "SubSource.keyword"
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
    .then(fetchedData => {
        var sourceKeys,subSourceKeys
        var uniqueSourceKeys = []
        var uniqueSubSourceKeys = []
        let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
        var languageKeys = getKeyArray(languageBuckets)
        if(languageKeys[0]){
            languageKeys.forEach((key,i) =>{
                let sourceBuckets = languageBuckets[i].Source.buckets
                sourceKeys = getKeyArray(sourceBuckets)
                sortedData[key] ={}
                sourceKeys.forEach((source,j) => {
                    if(!uniqueSourceKeys.includes(source)){
                        uniqueSourceKeys.push(source)
                    }
                    let subSourceBuckets = sourceBuckets[j].SubSource.buckets
                    subSourceKeys = getKeyArray(subSourceBuckets)
                    sortedData[key][source] = {}
                    subSourceKeys.forEach((subSource,k) => {
                        if(!uniqueSubSourceKeys.includes(subSource)){
                            uniqueSubSourceKeys.push(subSource)
                        }
                        sortedData[key][source][subSource] = {}
                        let perDayBuckets = subSourceBuckets[k]['per-day'].buckets
                        let perDayKeys = subSourceBuckets[k]['per-day'].buckets.map(item => item.key_as_string)
                        sortedData[key][source][subSource]['dates'] = perDayKeys
                        sortedData[key][source][subSource]['negative'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'negative'))
                        sortedData[key][source][subSource]['positive'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'positive'))
                        sortedData[key][source][subSource]['neutral'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'neutral'))
                    })
                });
            })
            console.log(sortedData)
            let availableSourceKeys = {}
            uniqueSourceKeys.forEach(source =>{
                availableSourceKeys[source] = true
            })
            setSources(availableSourceKeys)

            let availableLanguageKeys = {}
            languageKeys.forEach(lang =>{
                availableLanguageKeys[lang] = true
            })
            setLanguages(availableLanguageKeys)

            let availableSubSourceKeys = {}
            uniqueSubSourceKeys.forEach(subSource =>{
                availableSubSourceKeys[subSource]  = true
            })
            console.log(availableSubSourceKeys,uniqueSubSourceKeys)
            setSubSources(availableSubSourceKeys)

            setSentiments(prev => {
                if(Object.keys(prev).length){
                    return prev
                } else {
                    return {negative:true,positive:true,neutral:true}
                }
            })
        } else {
            sortedData = {}
            setSources({})
            setSubSources({})
            setLanguages({})
            setSentiments({})
        }
        
    })
    .catch(err => {
        console.log(err)
    })
    }, [from,to,refresh])


    useEffect(() => {
        let finalData  = sentimentalAnalysisAreaChartFilter(languages,sentiments,sources,subSources,sortedData,from,to)
            setData(finalData)
    }, [languages,sentiments,sources,subSources])
    return (
        <SideNav>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px', }}>
            {chartType === 'pie' && <Redirect to='/sentimental-analysis/pie-chart' />}
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px'}}>
                        Sentimental Analysis
                    </Typography>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item sm={8}>
                                <CardContent>
                                    Sentiment Wise Trend
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
                                    <MenuItem value='pie'>Pie chart</MenuItem>
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
                    <Grid container spacing={3} style={{position:'sticky',top:'60px'}} >
                        <Grid item xs={12} >
                            <FilterHeader refresh={[refresh,setRefresh]}/>
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters toFromDatesHandlers={[setFrom,setTo]} sources={[sources,setSources]} sentiments={[sentiments,setSentiments]} languages={[languages,setLanguages]} subSources={[subSources,setSubSources]} />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        </SideNav>
    );
}