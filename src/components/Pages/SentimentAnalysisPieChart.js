import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import FilterHeader from '../Filters/FilterHeader';
import FilterWrapper from '../Filters/FilterWrapper';
import AccordianFilters from '../Filters/AccordianFilters';
import { Button, Typography } from '@material-ui/core';
import { getKeyArray, getDocCountByKey } from '../../helpers';
import { sentimentAnalysisPieChartFilter } from '../../helpers/filter';
import PieChart from '../charts/PieChart';
import { addMonths } from '../../helpers/index';
import Loader from '../LoaderWithBackDrop';
import { Auth, header } from "./Auth";

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
export default function SentimentalAnalysisPieChart() {
    const [chartType, setChartType] = useState('pie')
    const [sentiments, setSentiments] = useState({})
    const [sources, setSources] = useState({})
    const [languages, setLanguages] = useState({})
    const [refresh, setRefresh] = useState(true)
    const [data, setData] = useState([])
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const [keywords, setKeywords] = useState([])
    const [keywordType, setKeywordType] = useState('Entire Data');
    const [open, setOpen] = useState(true)
    const classes = useStyles();
    const handleChange = (e) => {
        setChartType(e.target.value)
    }

    useEffect(() => {
        setData([])
        setOpen(true)
        // let query = {
        //     "aggs": {
        //       "date-based-range": {
        //         "date_range": {
        //            "field": "CreatedAt",
        //            "format": "dd-MM-yyyy",
        //            "ranges": [
        //              { "from": from, "to": to }
        //           ]
        //         },
        //         "aggs": {
        //           "lang": {
        //             "terms": {
        //               "field": "predictedLang.keyword"
        //             },
        //             "aggs": {
        //               "Source": {
        //                 "terms": {
        //                   "field": "Source.keyword"
        //                 },
        //                 "aggs": {
        //                       "per-day": {
        //                         "date_histogram": {
        //                             "field": "CreatedAt",
        //                             "format": "yyyy-MM-dd", 
        //                             "calendar_interval": "day"
        //                         },
        //                       "aggs": {
        //                         "Daily-Sentiment-Distro": {
        //                           "terms": {
        //                             "field": "predictedSentiment.keyword"
        //                           }
        //                         }
        //                       }
        //                       }
        //                   }
        //                   }
        //               }
        //             }
        //           }
        //         }
        //       }
        //     }
        //     if(keywordType === 'Screen Name'){
        //         query["query"] = {
        //             "terms": {
        //               "User.ScreenName.keyword": keywords
        //             }
        //           }
        //     } else if (keywordType === 'Hash Tags') {
        //         query["query"] =  {
        //             "terms": {
        //               "HashtagEntities.Text.keyword": keywords
        //             }
        //         }
        //     }

        // Axios.post(
        //   process.env.REACT_APP_URL,
        //   query,
        //   Auth
        // )
        let data = JSON.stringify({ queryStartDate: from, queryEndDate: to });

        let config = {
          method: "post",
          url: process.env.REACT_APP_URL + "query/sentimentanalysis",
          headers: header,
          data: data,
        };

        Axios(config)
          .then((fetchedData) => {
            var sourceKeys, sourceBuckets, perDayBuckets, perDayKeys;
            var uniqueSourceKeys = [];
            let languageBuckets =
              fetchedData.data.aggregations["date-based-range"].buckets[0].lang
                .buckets;
            var languageKeys = getKeyArray(languageBuckets);
            if (languageKeys[0]) {
              languageKeys.forEach((key, i) => {
                sourceBuckets = languageBuckets[i].Source.buckets;
                sourceKeys = getKeyArray(sourceBuckets);
                sortedData[key] = {};
                sourceKeys.forEach((source, j) => {
                  if (!uniqueSourceKeys.includes(source)) {
                    uniqueSourceKeys.push(source);
                  }
                  sortedData[key][source] = {};
                  perDayBuckets = sourceBuckets[j]["per-day"].buckets;
                  perDayKeys = sourceBuckets[j]["per-day"].buckets.map(
                    (item) => item.key_as_string
                  );
                  sortedData[key][source][
                    "negative"
                  ] = perDayBuckets.map((item) =>
                    getDocCountByKey(
                      item["Daily-Sentiment-Distro"].buckets,
                      "negative"
                    )
                  )[0];
                  sortedData[key][source][
                    "positive"
                  ] = perDayBuckets.map((item) =>
                    getDocCountByKey(
                      item["Daily-Sentiment-Distro"].buckets,
                      "positive"
                    )
                  )[0];
                  sortedData[key][source][
                    "neutral"
                  ] = perDayBuckets.map((item) =>
                    getDocCountByKey(
                      item["Daily-Sentiment-Distro"].buckets,
                      "neutral"
                    )
                  )[0];
                });
              });
              let availableSourceKeys = {};
              uniqueSourceKeys.forEach((source) => {
                availableSourceKeys[source] = true;
              });
              setSources(availableSourceKeys);
              let availableLanguageKeys = {};
              languageKeys.forEach((lang) => {
                availableLanguageKeys[lang] = true;
              });
              setLanguages(availableLanguageKeys);
              setSentiments((prev) => {
                if (Object.keys(prev).length) {
                  return prev;
                } else {
                  return { negative: true, positive: true, neutral: true };
                }
              });
            } else {
              setLanguages({});
              setSources({});
              setSentiments({});
              sortedData = {};
            }
            setOpen(false);
          })
          .catch((err) => {
            setOpen(false);
            console.log(err);
          });        

    }, [from,to,refresh,keywords,keywordType])

    useEffect(() => {
        let tempData = sentimentAnalysisPieChartFilter(languages,sentiments,sources,sortedData)
        if(tempData){
            setData(tempData)
        } 
    }, [languages,sentiments,sources])

    return (
        <>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px',position:'relative' }}>
            <Loader open={open} style={{position:'absolute'}} />
            {chartType === 'semi-pie' && (<Redirect to='/sentimental-analysis/semi-donut-chart' />) }
            {chartType === 'line' && (<Redirect to='/sentimental-analysis/line-chart' />) }
            {chartType === 'area' && (<Redirect to='/sentimental-analysis/area-chart' />) }
            {chartType === 'bar' && <Redirect to='/sentimental-analysis/bar-chart' />}
            {chartType === 'stack' && (<Redirect to='/sentimental-analysis/stack-chart' />) }
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px'}}>
                        Sentiment Analysis
                    </Typography>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={8}>
                                <CardContent>
                                    Source wise Sentiment Wise Distribution of Post
                                </CardContent>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Change Chart Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={chartType}
                                onChange={handleChange}
                                label="Change Chart type"
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
                            {Object.keys(data).map((source,i) => {
                                return (<Grid align='center' item key={i} lg={4} md={4} sm={6} xs={12} style={{marginBottom:'30px'}}>
                                <PieChart data={data[source]}/>
                                <Button variant='outlined' color='primary'>
                                    {source}
                                </Button>
                            </Grid>)
                            }
                            )}
                        </Grid>
                    </Card>
                </Grid>
                <Grid item sm={12} md={4}  >
                    <Grid container spacing={1}style={{position:'sticky',top:'60px'}}>
                        <Grid item xs={12} >
                        <FilterHeader refresh={[refresh,setRefresh]}/>
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters 
                                    toFromDatesHandlers={[setFrom,setTo,from,to]}
                                    sources={[sources, setSources]} 
                                    languages={[languages,setLanguages]} 
                                    sentiments={[sentiments,setSentiments]}
                                    setKeywords={setKeywords}
                                    keywordTypes={[keywordType, setKeywordType]}
                                />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        </>
    );
}