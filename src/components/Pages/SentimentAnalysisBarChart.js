import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import BarChart from '../charts/BarChart';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import FilterHeader from '../Filters/FilterHeader';
import FilterWrapper from '../Filters/FilterWrapper';
import AccordianFilters from '../Filters/AccordianFilters';
import { Dialog,Typography } from '@material-ui/core';
import { getKeyArray, getDocCountByKey } from '../../helpers';
import { sentimentalAnalysisAreaChartFilter } from '../../helpers/filter';
import Loader from '../LoaderWithBackDrop';
import useMountAndUpdateEffect from '../custom Hooks/useMountAndUpdateEffect';
import useDidUpdateEffect from '../custom Hooks/useDidUpdateEffect';
import { useContext } from 'react';
import { SentimentAnalysisFiltersContext } from '../../contexts/SentimentAnalysisContext';
import colors from '../../helpers/colors'
import {Auth,header} from './Auth'
 import Cookies from "js-cookie";
 import AppBar from "@material-ui/core/AppBar";
 import Toolbar from "@material-ui/core/Toolbar";
 import IconButton from "@material-ui/core/IconButton";
 import CloseIcon from "@material-ui/icons/Close";
 import TableWithData from "../Tables/TableWithData";
 import Box from '@material-ui/core/box'

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
const dateFormatter = (unix) => {
  var date = new Date(unix);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var todayDate = date.getDate();
  return (
    todayDate +
    "/" +
    month +
    "/" +
    year +
    " " +
    hours +
    ":" +
    minutes.substr(-2) +
    ":" +
    seconds.substr(-2)
  );
};
export default function SentimentalAnalysisAreaChart(props) {
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
    const [chartType, setChartType] = useState(props.stack ?'stack': 'bar')
    const [refresh, setRefresh] = useState(true)
    const [dates, setDates] = useState([])
    const [data, setData] = useState({})
    const [open, setOpen] = useState(true);
    const [tableData, setTableData] = useState([]);
    // const [open, setOpen] = useState(true);
    const [dialogopen, setDialogOpen] = useState(false);
  const [dialogclose, setDialogClose] = useState(false);
  const[searchword,setSearchword]=useState();
    const classes = useStyles();
    const handleChange = (e) => {
        setChartType(e.target.value)
    }
    function handleCellClick(date){
  
      let dt=date.split("-").reverse().join("-");;
      
     
       setSearchword(date)
       setDialogOpen(true)
       
       let token = Cookies.get("token");
      console.log(sources)
      let src=Object.entries(sources).map((data)=>{
        if(data[1]){
          return data[0]
        }
       console.log(data[1])
      })
      let lan=Object.entries(languages).map((data)=>{
        if(data[1]){
          return data[0]
        }
       console.log(data[1])
      })
      let sen=Object.entries(sentiments).map((data)=>{
        if(data[1]){
          return data[0]
        }
       console.log(data[1])
      })
      let key=Object.entries(keywords).map((data)=>{
        if(data[1]){
          return data[0]
        }
       console.log(data[1])
      })
    
   
       let data = JSON.stringify({
         querySources: src,
         queryLanguages:lan,
         querySearchFromSentiment: true,
         querySentiments: sen,
         queryHashtagEntities:key,
         queryStartDate:dt,
         queryEndDate:dt
       });
       let config = {
         method: "post",
         url: process.env.REACT_APP_URL + "query/search",
         headers: {
           "Content-Type": "application/json",
           token: token,
         },
         data: data,
       };
   
       Axios(config)
         .then((fetchedData) => {
           console.log(fetchedData)
           setTableData(
             fetchedData.data.hits.hits.map((postObj) => {
               if (!postObj._source.User) {
                 return {
                   date: dateFormatter(postObj._source.CreatedAt),
                   post: postObj._source.Text,
                   source: postObj._source.Source,
                   subSource: postObj._source.SubSource,
                   favouriteCount: postObj._source.FavoriteCount,
                   sentiment: postObj._source.predictedSentiment,
                   mood: postObj._source.predictedMood,
                   language: postObj._source.predictedLang,
                 };
               } else {
                 return {
                   date: dateFormatter(postObj._source.CreatedAt),
                   post: postObj._source.Text,
                   source: postObj._source.Source,
                   subSource: postObj._source.SubSource,
                   favouriteCount: postObj._source.FavoriteCount,
                   sentiment: postObj._source.predictedSentiment,
                   mood: postObj._source.predictedMood,
                   language: postObj._source.predictedLang,
                   followersCount: postObj._source.User.FollowersCount,
                   location: postObj._source.User.Location,
                   name: postObj._source.User.Name,
                   screenName: postObj._source.User.ScreenName,
                 };
               }
             })
           );
         })
       }
       const handleClose=()=>{
        setDialogOpen(false)
            }
    const fetchData = (changeInState) => {
        setOpen(true)
      //   let query = {
      //       "aggs": {
      //         "date-based-range": {
      //           "date_range": {
      //             "field": "CreatedAt",
      //             "format": "dd-MM-yyyy",
      //             "ranges": [
      //               { "from": from,"to": to}
      //             ]
      //           },
      //           "aggs": {
      //             "lang": {
      //               "terms": {
      //                 "field": "predictedLang.keyword"
      //               },
      //               "aggs": {
      //                 "Source": {
      //                   "terms": {
      //                     "field": "Source.keyword"
      //                   },
      //                   "aggs":{
      //                       "SubSource":{
      //                           "terms":{
      //                               "field": "SubSource.keyword"
      //                           },
                            
    
      //                       "aggs": {
      //                           "per-day": {
      //                             "date_histogram": {
      //                                 "field": "CreatedAt",
      //                                 "format": "yyyy-MM-dd", 
      //                                 "calendar_interval": "day"
      //                             },
      //                           "aggs": {
      //                             "Daily-Sentiment-Distro": {
      //                               "terms": {
      //                                 "field": "predictedSentiment.keyword"
      //                               }
      //                             }
      //                           }
      //                           }
      //                       }
      //                     }
      //                   }
      //                   }
      //                 }
      //               }
      //             }
      //           }
      //         }
      //       }
      //   if(keywordType === 'Screen Name'){
      //       query["query"] = {
      //           "terms": {
      //             "User.ScreenName.keyword": keywords
      //           }
      //         }
      //   } else if (keywordType === 'Hash Tags') {
      //       query["query"] =  {
      //           "terms": {
      //             "HashtagEntities.Text.keyword": keywords
      //           }
      //       }
      //   }
      //  Axios.post(
      //    process.env.REACT_APP_URL,
      //    query,
        
      //    Auth
      //  )
let data = "";
if (keywordType === "Hash Tags") {
  data = JSON.stringify({
    queryStartDate: from,
    queryEndDate: to,
    queryHashtagEntities: keywords,
  });
}
if (keywordType === "Screen Name") {
  data = JSON.stringify({
    queryStartDate: from,
    queryEndDate: to,
    queryUserScreenNames: keywords,
  });
}
if (keywordType === "Entire Data") {
  data = JSON.stringify({
    queryStartDate: from,
    queryEndDate: to,
  });
}let token = Cookies.get("token");

      let config = {
        method: "post",
        url: process.env.REACT_APP_URL + "query/sentimentanalysis",
        headers: {
    'Content-Type': 'application/json', 
    'token': token
  },
        data: data,
      };

      Axios(config)
        .then((fetchedData) => {
          var sourceKeys, subSourceKeys;
          var uniqueSourceKeys = [];
          var uniqueSubSourceKeys = [];
          let languageBuckets =
            fetchedData.data.aggregations["date-based-range"].buckets[0].lang
              .buckets;
          var languageKeys = getKeyArray(languageBuckets);
          if (languageKeys[0]) {
            languageKeys.forEach((key, i) => {
              let sourceBuckets = languageBuckets[i].Source.buckets;
              sourceKeys = getKeyArray(sourceBuckets);
              sortedData[key] = {};
              sourceKeys.forEach((source, j) => {
                if (!uniqueSourceKeys.includes(source)) {
                  uniqueSourceKeys.push(source);
                }
                let subSourceBuckets = sourceBuckets[j].SubSource.buckets;
                subSourceKeys = getKeyArray(subSourceBuckets);
                sortedData[key][source] = {};
                subSourceKeys.forEach((subSource, k) => {
                  if (!uniqueSubSourceKeys.includes(subSource)) {
                    uniqueSubSourceKeys.push(subSource);
                  }
                  sortedData[key][source][subSource] = {};
                  let perDayBuckets = subSourceBuckets[k]["per-day"].buckets;
                  let perDayKeys = subSourceBuckets[k]["per-day"].buckets.map(
                    (item) => item.key_as_string
                  );
                  sortedData[key][source][subSource]["dates"] = perDayKeys;
                  sortedData[key][source][subSource][
                    "positive"
                  ] = perDayBuckets.map((item) =>
                    getDocCountByKey(
                      item["Daily-Sentiment-Distro"].buckets,
                      "positive"
                    )
                  );
                  sortedData[key][source][subSource][
                    "negative"
                  ] = perDayBuckets.map((item) =>
                    getDocCountByKey(
                      item["Daily-Sentiment-Distro"].buckets,
                      "negative"
                    )
                  );
                  sortedData[key][source][subSource][
                    "neutral"
                  ] = perDayBuckets.map((item) =>
                    getDocCountByKey(
                      item["Daily-Sentiment-Distro"].buckets,
                      "neutral"
                    )
                  );
                });
              });
            });

            if (changeInState) {
              setSources((prev) => {
                let availableSourceKeys = {};
                uniqueSourceKeys.forEach((source) => {
                  availableSourceKeys[source] = !!prev[source];
                });
                return availableSourceKeys;
              });
              setLanguages((prev) => {
                let availableLanguageKeys = {};
                languageKeys.forEach((lang) => {
                  availableLanguageKeys[lang] = !!prev[lang];
                });
                return availableLanguageKeys;
              });
              setSubSources((prev) => {
                let availableSubSourceKeys = {};
                uniqueSubSourceKeys.forEach((subSource) => {
                  availableSubSourceKeys[subSource] = !!prev[subSource];
                });
                return availableSubSourceKeys;
              });
              setSentiments((prev) => {
                if (Object.keys(prev).length) {
                  return prev;
                } else {
                  return { negative: true, positive: true, neutral: true };
                }
              });
            } else {
              setSources((prev) => {
                let availableSourceKeys = {};
                uniqueSourceKeys.forEach((source) => {
                  availableSourceKeys[source] = true;
                });
                return availableSourceKeys;
              });

              setLanguages((prev) => {
                let availableLanguageKeys = {};
                languageKeys.forEach((lang) => {
                  availableLanguageKeys[lang] = true;
                });
                return availableLanguageKeys;
              });
              setSubSources((prev) => {
                let availableSubSourceKeys = {};
                uniqueSubSourceKeys.forEach((subSource) => {
                  availableSubSourceKeys[subSource] = true;
                });
                return availableSubSourceKeys;
              });
              setSentiments((prev) => {
                if (Object.keys(prev).length) {
                  return prev;
                } else {
                  return { negative: true, positive: true, neutral: true };
                }
              });
            }
            setOpen(false);
          } else {
            sortedData = {};
            setSources({});
            setSubSources({});
            setLanguages({});
            setSentiments({});
            setOpen(false);
          }
        })
        .catch((err) => {
          console.log(err.response);
          setOpen(false);
        });
    }

    useMountAndUpdateEffect(()=>{
        fetchData(false)
    },()=>{
        fetchData(true)
    },[from,to,keywords])

    useDidUpdateEffect(()=>{
        if(keywordType === 'Entire Data'){
            fetchData(true)
        }
    },[keywordType])

    useDidUpdateEffect(() =>{
        setData([])
        fetchData(false)
    },[refresh])


    useEffect(() => {
        const [finalData]  = sentimentalAnalysisAreaChartFilter(languages,sentiments,sources,subSources,sortedData,from,to)
        setDates(finalData.dates)
        let obj = []
        Object.keys(finalData).forEach(key => {
            if(key !== 'dates'){
                obj.push({
                    name:key,
                    color:colors[key],
                    data:finalData[key]
                })
            }
        })
        setData(obj)
    }, [languages, sentiments, subSources])

    useEffect(() => {
        const [finalData,availableSubSources]  = sentimentalAnalysisAreaChartFilter(languages,sentiments,sources,subSources,sortedData,from,to)
        setDates(finalData.dates)
        let obj = []
        Object.keys(finalData).forEach(key => {
            if(key !== 'dates'){
                obj.push({
                    name:key,
                    color:colors[key],
                    data:finalData[key]
                })
            }
        })
        setData(obj)
        let availableSubSourceKeys = {}
        availableSubSources.forEach(subSource =>{
            availableSubSourceKeys[subSource]  = true
        })
        setSubSources(availableSubSourceKeys)
    }, [sources])

    return (
        <>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px',position:'relative' }}>
            <Loader open={open} style={{position:'absolute'}} />
            {chartType === 'semi-pie' && (<Redirect to='/sentimental-analysis/semi-donut-chart' />) }
            {chartType === 'line' && (<Redirect to='/sentimental-analysis/line-chart' />) }
            {chartType === 'pie' && (<Redirect to='/sentimental-analysis/pie-chart' />) }
            {chartType === 'area' && (<Redirect to='/sentimental-analysis/area-chart' />) }
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px'}}>
                        Sentiment Analysis
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
                            {/* <MenuItem value='pie'>Pie chart</MenuItem>
                            <MenuItem value='semi-pie'>Semi Pie chart</MenuItem>                 */}
                            </Select>
                            </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <BarChart categories={dates} stacking={chartType==='stack' ? 'normal' : ''} title={`Date Wise Sentiment ${chartType==='stack' ? 'Stacked Bar Chart' : 'Bar Chart'}`} data={data} onClick={handleCellClick}/>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item sm={12} md={4}  >
                    <Grid container spacing={1} style={{position:'sticky',top:'60px'}} >
                        <Grid item xs={12} >
                            <FilterHeader refresh={[refresh,setRefresh]}/>
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters 
                                    toFromDatesHandlers={[setFrom,setTo,from,to]} 
                                    sources={[sources,setSources]} 
                                    sentiments={[sentiments,setSentiments]} 
                                    languages={[languages,setLanguages]} 
                                    subSources={[subSources,setSubSources]} 
                                    setKeywords={setKeywords}
                                    keywords={keywords}
                                    keywordTypes={[keywordType, setKeywordType]}
                                />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog
          fullScreen
          open={dialogopen}
          onClose={handleClose}
          // TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {searchword}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box p={4}>

          <TableWithData rows={tableData} />
          </Box>
        </Dialog>
        </div>
        </>
    );
}