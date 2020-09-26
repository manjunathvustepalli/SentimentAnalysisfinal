import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Typography,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  makeStyles,
  Button,
} from "@material-ui/core";
import FilterWrapper from "../Filters/FilterWrapper";
import AccordianFilters from "../Filters/AccordianFilters";
import FilterHeader from "../Filters/FilterHeader";
import { getKeyArray } from "../../helpers";
import TrendingSubjectsBarChart from "../charts/TrendingSubjectsBarChart";
import Axios from "axios";
import Alert from '@material-ui/lab/Alert';
import { Link } from "react-router-dom";
import { TrendingSubjectFiltersContext } from "../../contexts/TrendingSubjectContext";


var sortedData = {}
const useStyles = makeStyles((theme) => ({
  main: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CB0038",
  },
  formControl: {
    margin: "20px",
    display: "flex",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  dataDate: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginTop: 50,
  },
  paper: {
    height: 140,
    width: 130,
  },
  tablecenter: {
    marginLeft: "30px !important",
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


function InfluencerAnalysis() {
  const trendingSubjectsFilters = useContext(TrendingSubjectFiltersContext)
  const {
    sources, 
    setSources,
    source, 
    setSource,
    subSources,
    setSubSources,
    subSource, 
    setSubSource,
    languages, 
    setLanguages,
    language, 
    setLanguage,
    from, 
    setFrom,
    to,
    setTo,
    sentiment,
    sentiments,
    setSentiment,
    setSentiments,
    keywords,
    setKeywords,
    keywordType,
    setKeywordType
} = trendingSubjectsFilters


  const [refresh, setRefresh] = useState(true);
  const [data, setData] = useState([])
  const [noData, setnoData] = useState(false)
  const classes = useStyles();
  const fetchData = () => {
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
  .then(fetchedData => {
    let uniqueSources = []
    let uniqueSubSources = []
    let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
    let languageKeys = getKeyArray(languageBuckets)
    languageKeys.forEach((language,i) => {
      sortedData[language] = {}
      let sourceBuckets = languageBuckets[i].Source.buckets
      let sourceKeys = getKeyArray(sourceBuckets)
      sourceKeys.forEach((source,j) =>{
        if(!uniqueSources.includes(source)){
          uniqueSources.push(source)
        }
        sortedData[language][source] = {}
        let subSourceBuckets = sourceBuckets[j].SubSource.buckets
        let subSourceKeys = getKeyArray(subSourceBuckets)
        subSourceKeys.forEach((subSource,k) => {
          if(!uniqueSubSources.includes(subSource)){
            uniqueSubSources.push(subSource)
          }
          sortedData[language][source][subSource] = {}
          let sentimentBuckets = subSourceBuckets[k]['Daily-Sentiment-Distro'].buckets
          let sentimentKeys = getKeyArray(sentimentBuckets)
          sentimentKeys.forEach((sentiment,l)=>{
              sortedData[language][source][subSource][sentiment] = sentimentBuckets[l].Words.buckets.map(wordObj => {
                  return {
                    name:wordObj.key,
                    y:wordObj.doc_count
                  }
                })
          })
        })
      })
    })
    let selectedLanguage 
    let selectedSource 
setLanguages(languageKeys)
setLanguage(prev => {
  if(languageKeys.includes(prev)){
    selectedLanguage = prev
    return prev
  } else {
    selectedLanguage = languageKeys[0] 
   return languageKeys[0]
  }
} )
setSources(uniqueSources)
setSource(prev => {
  if(uniqueSources.includes(prev)){
    selectedSource = prev
    return prev
  } else {
    selectedSource = uniqueSources[0] 
    return uniqueSources[0]
  }
})    
setSubSources(Object.keys(sortedData[selectedLanguage][selectedSource]))
setSubSource(prev =>{
  if(Object.keys(sortedData[selectedLanguage][selectedSource]).includes(prev)){
    return prev
  } else {
    return Object.keys(sortedData[selectedLanguage][selectedSource])[0] 
  }
})
  })
  .catch(err=>{
    console.log(err)
  })  
}


useEffect(()=>{
  fetchData()
},[from,to,refresh,keywords,keywordType])

useEffect(() => {
   try{
     if(sortedData[language][source][subSource][sentiment]){
       setData(sortedData[language][source][subSource][sentiment])
       setnoData(false)
     } else {
         setnoData(true)
         setData([])
     }
   }
   catch(err){
        setData([])
        setnoData(true)
   }
}, [subSource,sentiment])

useEffect(() => {
  try{
    if(sortedData[language][source][subSource][sentiment]){
      setData(sortedData[language][source][subSource][sentiment])
      setnoData(false)
    }
  } catch(err){
    if(sortedData[language]){
      if(sortedData[language][source]){
        setSubSources(Object.keys(sortedData[language][source]))
        setSubSource(Object.keys(sortedData[language][source])[0])
      }
    }
    setnoData(true)
    console.log(err)
  }

}, [source,language])

  return (
    <>
      <div style={{ backgroundColor: "#F7F7F7", padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item md={8} sm={12}>
          <Typography style={{ color: "#43B02A", fontSize: "30px" }}>
                Trending Subjects
              </Typography>
            <Card className={classes.main}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={6}>
                  <FormControl
                    className={classes.formControl}
                    variant="outlined"
                  >
                    <InputLabel id="select-table">Select Sentiment</InputLabel>
                    <Select
                      labelId="select-table"
                      id="demo-simple-select-outlined"
                      varient="outlined"
                      label="Select Sentiment"
                      value={sentiment}
                      onChange={(e) => setSentiment(e.target.value)}
                    >
                      <MenuItem value="positive">
                        Positive
                      </MenuItem>
                      <MenuItem value="negative">Negative</MenuItem>
                      <MenuItem value="neutral">Neutral</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} align='right'>
                                    <Button
                                        variant="contained"
                                        style={{margin:"10px"}}
                                        component={Link}
                                        to="/trending-subject/mood"
                                        >
                                        Mood
                                    </Button>
                                    <Button
                                        variant="contained"
                                        style={{margin:"10px"}}
                                        className={classes.buttonStyle}
                                        component={Link}
                                        to="/trending-subject/sentiment"
                                    >
                                        Sentiment                                                                       
                                    </Button>
                            </Grid>

                <Grid item xs={12} className={classes.tablecenter}>
                  <TrendingSubjectsBarChart data={data} />
                </Grid>
                {/* <Grid item xs={11}>
                  <TrendingSubjectsTable />
                </Grid> */}
              </Grid>
            </Card>
          </Grid>
          <Grid item sm={12} md={4}>
            <Grid container spacing={1}style={{position:'sticky',top:'60px'}}>
              <Grid item xs={12}>
                <FilterHeader refresh={[refresh, setRefresh]} />
              </Grid>
              {
                  sources.length && subSources.length && languages.length && noData ? (
                    <Grid item xs={12}>
                    <Alert variant="filled" severity="error">
                        No Data available, Please change the Filters
                    </Alert>
                  </Grid>
                  ) : (
                    <span></span>
                  )
              }
              <Grid item xs={12}>
                <FilterWrapper>
                  <AccordianFilters
                    toFromDatesHandlers={[setFrom, setTo,from,to]}
                    radioSources={[source,setSource,sources]}
                    radioLanguages={[language,setLanguage,languages]}
                    AutoCompleteSubSources={[subSource,setSubSource,subSources]}
                    setKeywords={setKeywords}
                    keywords={keywords}
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

export default InfluencerAnalysis;
