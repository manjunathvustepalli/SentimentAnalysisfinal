import React,{useState, useEffect,useContext} from 'react';
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
import Loader from '../LoaderWithBackDrop';
import { SentimentAnalysisFiltersContext } from '../../contexts/SentimentAnalysisContext';
import useDidUpdateEffect  from '../custom Hooks/useDidUpdateEffect';
import useMountAndUpdateEffect from '../custom Hooks/useMountAndUpdateEffect';


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
    const sentimentFilters = useContext(SentimentAnalysisFiltersContext)
    const {
        keywords,
        setKeywords,
        keywordType, 
        setKeywordType,
        from,
        setFrom,
        to,
        setTo,
        sources,
        setSources,
        subSources,
        setSubSources,
        languages,
        setLanguages,
        sentiments,
        setSentiments
    } = sentimentFilters
    let colors = { 'positive':'rgb(0,255,0)','negative':'rgb(255,0,0)','neutral':'rgb(235,255,0)' } 
    const [chartType, setChartType] = useState('area')
    const [refresh, setRefresh] = useState(true)
    const [data, setData] = useState({})
    const [open, setOpen] = useState(true)
    const classes = useStyles();
    const handleChange = (e) => {
        setChartType(e.target.value)
    }

    const fetchData = (changeInState) => {
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
    .then(fetchedData => {
        setOpen(true)
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
                        sortedData[key][source][subSource]['positive'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'positive'))
                        sortedData[key][source][subSource]['negative'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'negative'))
                        sortedData[key][source][subSource]['neutral'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'neutral'))
                    })
                });
            })
            console.log(sortedData,uniqueSourceKeys,uniqueSubSourceKeys,languageKeys)

            if(changeInState){

            if(uniqueSourceKeys.length){
                setSources(prev =>{
                    let availableSourceKeys = {}
                    uniqueSourceKeys.forEach(source =>{
                        console.log(prev[source],!!prev[source])
                        availableSourceKeys[source] = !!prev[source]
                    })
                    return availableSourceKeys
                })
            }    

            if(languageKeys.length){
                setLanguages(prev =>{
                    let availableLanguageKeys = {}
                    languageKeys.forEach(lang =>{
                        availableLanguageKeys[lang] = !!prev[lang]
                    })
                    return availableLanguageKeys
                })    
            }

            if(uniqueSubSourceKeys.length){
                setSubSources(prev =>{
                    let availableSubSourceKeys = {}
                    uniqueSubSourceKeys.forEach(subSource =>{
                        availableSubSourceKeys[subSource]  = !!prev[subSource]
                    })
                    return availableSubSourceKeys
                })    
            }

            setSentiments(prev => {
                if(Object.keys(prev).length){
                    return prev
                } else {
                    return {negative:true,positive:true,neutral:true}
                }
            })
            } else {
            
            if(uniqueSourceKeys.length){
                setSources(prev =>{
                    let availableSourceKeys = {}
                    uniqueSourceKeys.forEach(source =>{
                        availableSourceKeys[source] = true
                    })
                    return availableSourceKeys
                })    
            }

            if(languageKeys.length){  
            setLanguages(prev =>{
                let availableLanguageKeys = {}
                languageKeys.forEach(lang =>{
                    availableLanguageKeys[lang] = true
                })
                return availableLanguageKeys
            })
            }

            if(uniqueSubSourceKeys.length){
                console.log('yes,i am')
                setSubSources(prev =>{
                    let availableSubSourceKeys = {}
                    uniqueSubSourceKeys.forEach(subSource =>{
                        availableSubSourceKeys[subSource]  = true
                    })
                    return availableSubSourceKeys
                })
            }

            setSentiments(prev => {
                if(Object.keys(prev).length){
                    return prev
                } else {
                    return {negative:true,positive:true,neutral:true}
                }
            })
            }
            
            setOpen(false)
        } else {
            sortedData = {}
            setSources({})
            setSubSources({})
            setLanguages({})
            setSentiments({})
            setOpen(false)
        }       
    })
    .catch(err => {
        console.log(err)
        setOpen(false)
    })
    }

    useMountAndUpdateEffect(()=>{
        fetchData(false)
    },()=>{
        fetchData(true)
    },[from,to,refresh,keywords])

    useDidUpdateEffect(()=>{
        if(keywordType === 'Entire Data'){
            fetchData(true)
        }
    },[keywordType])


    useEffect(() => {
        const [finalData]  = sentimentalAnalysisAreaChartFilter(languages,sentiments,sources,subSources,sortedData,from,to)
            setData(finalData)
    }, [languages,sentiments,subSources])

    useEffect(() => {
        const [finalData,availableSubSources]  = sentimentalAnalysisAreaChartFilter(languages,sentiments,sources,subSources,sortedData,from,to)
            setData(finalData)
            let availableSubSourceKeys = {}
            availableSubSources.forEach(subSource =>{
                availableSubSourceKeys[subSource]  = true
            })
            setSubSources(availableSubSourceKeys)
    }, [sources])

    return (
        <SideNav>
            <Loader open={open} />
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px 0px 20px 20px', }}>
            {chartType === 'semi-pie' && (<Redirect to='/sentimental-analysis/semi-donut-chart' />) }
            {chartType === 'line' && (<Redirect to='/sentimental-analysis/line-chart' />) }
            {chartType === 'pie' && (<Redirect to='/sentimental-analysis/pie-chart' />) }
            {chartType === 'bar' && (<Redirect to='/sentimental-analysis/bar-chart' />) }
            {chartType === 'stack' && (<Redirect to='/sentimental-analysis/stack-chart' />) }
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
                                label="Change Chart Type"
                            >
                            <MenuItem value='area'>Area chart</MenuItem>
                            <MenuItem value='line'>Line chart</MenuItem>
                            <MenuItem value='bar'>Bar chart</MenuItem>
                            <MenuItem value='stack'>Stacked Bar chart</MenuItem>
                            <MenuItem value='pie'>Pie chart</MenuItem>
                            <MenuItem value='semi-pie'>Semi Pie chart</MenuItem>           
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
                                <AccordianFilters 
                                    toFromDatesHandlers={[setFrom,setTo]} 
                                    sources={[sources,setSources]} 
                                    sentiments={[sentiments,setSentiments]} 
                                    languages={[languages,setLanguages]} 
                                    subSources={[subSources,setSubSources]}
                                    keywords={keywords}
                                    setKeywords={setKeywords}
                                    keywordTypes={[keywordType, setKeywordType]}
                                />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        </SideNav>
    );
}