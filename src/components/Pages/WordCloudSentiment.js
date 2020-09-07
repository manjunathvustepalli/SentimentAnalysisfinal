import React,{useState, useEffect} from 'react'
import SideNav from '../Navigation/SideNav'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { Redirect, Link } from 'react-router-dom';
import FilterHeader from '../Filters/FilterHeader';
import FilterWrapper from '../Filters/FilterWrapper';
import AccordianFilters from '../Filters/AccordianFilters';
import { Typography, Button, MenuItem, Select, InputLabel, FormControl } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import WordCloud from '../charts/WordCloudChart';
import {addMonths, getKeyArray} from '../../helpers'
import { green } from '@material-ui/core/colors';
import Axios from 'axios';
import {wordCloudSentimentFilter} from '../../helpers/filter';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
      },
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
      buttonStyle:{
        border:'1px solid green',
        color:'white',
        backgroundColor:"green",
        '&:hover': {
            backgroundColor:"green",
        }
    }
}));

var sortedData = {}

function WordCloudSentiment() {

    const classes = useStyles();

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
      };

    const [sentiments, setSentiments] = useState({negative:true,positive:true,neutral:true})
    const [sources, setSources] = useState({})
    const [subSources,setSubSources] = useState({})
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const [value, setValue] = useState(0);
    const [refresh, setRefresh] = useState(true)
    const [data, setData] = useState({})
    const [wordCount, setWordCount] = useState(30)
    const [keywords, setKeywords] = useState([])
    const [keywordType, setKeywordType] = useState('Entire Data')


    useEffect( () => {
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
                                                "field":"SubSource.keyword"
                                            },
                                            "aggs":{
                                                "Daily-Sentiment-Distro": {
                                                    "terms": {
                                                      "field": "predictedSentiment.keyword"
                                                    },
                                                    "aggs":{
                                                        "Words":{
                                                            "terms":{
                                                                "field":"HashtagEntities.Text.keyword"
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
        Axios.post(process.env.REACT_APP_URL,query)
          .then(fetchedData =>{
            var sourceKeys,subSourceKeys,sentimentKeys
            var uniqueSourceKeys = []
            var uniqueSubSourceKeys = []
            let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
            var languageKeys = getKeyArray(languageBuckets)
            languageKeys.forEach((key,i) => {
                let sourceBuckets = languageBuckets[i].Source.buckets
                sourceKeys = getKeyArray(sourceBuckets)
                sortedData[key] = {}
                sourceKeys.forEach((source,j) => {
                    if(!uniqueSourceKeys.includes(source)){
                        uniqueSourceKeys.push(source)
                    }
                    sortedData[key][source] = {}
                    let subSourceBuckets = sourceBuckets[j].SubSource.buckets
                    subSourceKeys = getKeyArray(subSourceBuckets)
                    subSourceKeys.forEach((subSource,k)=>{
                        if(!uniqueSubSourceKeys.includes(subSource)){
                            uniqueSubSourceKeys.push(subSource)
                        }
                        sortedData[key][source][subSource] = {}
                        let sentimentBuckets = subSourceBuckets[k]['Daily-Sentiment-Distro'].buckets
                        sentimentKeys = getKeyArray(sentimentBuckets)
                        sentimentKeys.forEach((sentiment,l)=>{
                            sortedData[key][source][subSource][sentiment] = sentimentBuckets[l].Words.buckets.map(wordObj => {
                                if(sentiment === 'negative'){
                                    return {
                                        name:wordObj.key,
                                        weight:wordObj.doc_count,
                                        color:'rgb(255,0,0)'
                                    }
                                } else if(sentiment === 'positive'){
                                    return {
                                        name:wordObj.key,
                                        weight:wordObj.doc_count,
                                        color:'rgb(0,255,0)'
                                    }
                                } else {
                                    return {
                                        name:wordObj.key,
                                        weight:wordObj.doc_count,
                                        color:'rgb(255,255,0)'
                                    }
                                }
                            })
                        })
                    })
                })
            })
            let availableSourceKeys = {}
            uniqueSourceKeys.forEach(source =>{
                availableSourceKeys[source] = true
            })
            setSources(availableSourceKeys)

            let availableSubSourceKeys = {}
            uniqueSubSourceKeys.forEach(subSource =>{
                availableSubSourceKeys[subSource]  = true
            })
            setSubSources(availableSubSourceKeys)

            setSentiments(prev => {
                if(Object.keys(prev).length){
                    return prev
                } else {
                    return {negative:true,positive:true,neutral:true}
                }
            })

          })
          .catch(err => {
              console.log(err.response)
          })
    },[to,from,refresh,keywords,keywordType])

    useEffect(() => {
        let temp = wordCloudSentimentFilter(sources,subSources,sentiments,sortedData)
        Object.keys(temp).forEach(language => {
            temp[language] = temp[language].sort((a,b)=>{
                return b.weight - a.weight
            }).slice(0,wordCount)
        })
        setData(temp) 
    },[sources,subSources,sentiments,wordCount])

    return (
        <SideNav>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px 0px 20px 20px' }}>
            <Grid container spacing={2} >
                <Grid item sm={12} md={8}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px'}}>
                        Word Cloud
                    </Typography>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} align='left'>
                            <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">Word Count</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={wordCount}
                                            onChange={(e) => setWordCount(e.target.value)}
                                            label="Reload Interval "
                                        >
                                    <MenuItem value={10}>10 Words</MenuItem>
                                    <MenuItem value={20}>20 Words</MenuItem>
                                    <MenuItem value={30}>30 Words</MenuItem>
                                    <MenuItem value={40}>40 Words</MenuItem>
                                    <MenuItem value={50}>50 Words</MenuItem>
                                    <MenuItem value={75}>75 Words</MenuItem>
                                    <MenuItem value={100}>100 Words</MenuItem>
                                    </Select>
                            </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} align='right'>
                                <Button
                                        variant="contained"
                                        style={{margin:"10px"}}
                                        component={Link}
                                        to="/word-cloud/mood"
                                    >
                                    Mood
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{margin:"10px"}}
                                    className={classes.buttonStyle}
                                    component={Link}
                                    to="/word-cloud/sentiment"
                                >
                                    Sentiment                                                                       
                                </Button>
                            </Grid>
                            <Grid item xs={12} align='right'>
                            <AppBar position="static" color="white">
                                <Tabs
                                value={value}
                                onChange={handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                                TabIndicatorProps={{style: {background:green[800]}}}
                                aria-label="scrollable auto tabs example"
                                >
                                    {
                                        Object.keys(data).map((lang,i)=> (<Tab label={lang} style={{color:value===i && (green[800])}} {...a11yProps(i)} />))
                                    }
                                </Tabs>
                            </AppBar>
                            </Grid>
                            <Grid item xs={12}>
                                {
                                    Object.keys(data).map((lang,i) => {
                                        return (
                                            <TabPanel value={value} index={i}>
                                                <WordCloud data={data[lang]} />
                                            </TabPanel>
                                        )
                                    })
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item sm={12} md={4} >
                    <Grid container spacing={3} style={{position:'sticky',top:'60px'}}>
                        <Grid item xs={12} >
                        <FilterHeader refresh={[refresh,setRefresh]}/>
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters  
                                    toFromDatesHandlers={[setFrom,setTo]} 
                                    sources={[sources, setSources]} 
                                    sentiments={[sentiments,setSentiments]}
                                    subSources={[subSources,setSubSources]}
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
    )
}

export default WordCloudSentiment
