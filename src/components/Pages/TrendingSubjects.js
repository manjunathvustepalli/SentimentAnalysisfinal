import React, { useState } from "react";
import SideNav from "../Navigation/SideNav";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  makeStyles,
} from "@material-ui/core";
import FilterWrapper from "../Filters/FilterWrapper";
import AccordianFilters from "../Filters/AccordianFilters";
import FilterHeader from "../Filters/FilterHeader";
import { addMonths, getKeyArray } from "../../helpers";
import TrendingSubjectsTable from "../Tables/TrendingSubjectsTable";
import TrendingSubjectsBarChart from "../charts/TrendingSubjectsBarChart";
import Axios from "axios";

var sortedData = {}

function InfluencerAnalysis() {
  const [refresh, setRefresh] = useState(true);
  const [sources, setSources] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [from, setFrom] = useState(addMonths(new Date(), -1));
  const [to, setTo] = useState(addMonths(new Date(), 0));
  const [moods, setMoods] = useState({});
  const [sentiments, setSentiments] = useState({});

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
  }));

  const classes = useStyles();

  Axios.post(process.env.REACT_APP_URL,{
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
                                                      "Daily-Mood-Distro":{
                                                        "terms":{
                                                          "field":"predictedMood.keyword"
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
    }
})
.then(fetchedData =>{
  let uniqueSources = []
  let uniqueSubSources = []
  let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
  let languageKeys = getKeyArray(languageBuckets)
  console.log(languageKeys)
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
          sortedData[language][source][subSource][sentiment] = {}
          let moodBuckets  = sentimentBuckets[l]['Daily-Mood-Distro'].buckets
          let moodKeys = getKeyArray(moodBuckets)
          moodKeys.forEach((mood,m)=>{
            sortedData[language][source][subSource][sentiment][mood] = moodBuckets[m].Words.buckets.map(wordObj => {
              return {
                name:wordObj.key,
                y:wordObj.doc_count
              }
            })
          })
        })
      })
    })
  })
  console.log(sortedData,uniqueSources,uniqueSubSources)
})
.catch(err=>{
  console.log(err)
})

  return (
    <SideNav>
      <Typography style={{ color: "#43B02A", fontSize: "30px" }}>
        Trending Subjects
      </Typography>
      <div style={{ backgroundColor: "#F7F7F7", padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item md={8} sm={12}>
            <Card className={classes.main}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={6}>
                  <FormControl
                    className={classes.formControl}
                  >
                    <InputLabel id="select-table">Select Sentiment</InputLabel>
                    <Select
                      labelId="select-table"
                      id="demo-simple-select-outlined"
                      varient={"standard"}
                    >
                      <MenuItem value="Positive">
                        Positive
                      </MenuItem>
                      <MenuItem value="Negative">Negative</MenuItem>
                      <MenuItem value="Neutral">Neutral</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6}>
                  <FormControl
                    className={classes.formControl}
                  >
                    <InputLabel id="select-table">Select Mood</InputLabel>
                    <Select
                      labelId="select-table"
                      id="demo-simple-select-outlined"
                      varient={"standard"}
                    >
                      <MenuItem value="happy">
                        Happy
                      </MenuItem>
                      <MenuItem value="sad">Sad</MenuItem>
                      <MenuItem value="anger">Anger</MenuItem>
                      <MenuItem value="anticipation">Anticipation</MenuItem>
                      <MenuItem value="disgust">Disgust</MenuItem>
                      <MenuItem value="suprice">Suprice</MenuItem>
                      <MenuItem value="fear">Fear</MenuItem>
                      <MenuItem value="trust">Trust</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} className={classes.tablecenter}>
                  <TrendingSubjectsBarChart />
                </Grid>
                <Grid item xs={11}>
                  <TrendingSubjectsTable />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item sm={12} md={4}>
            <Grid container spacing={3} style={{position:'sticky',top:'60px'}}>
              <Grid item xs={12}>
                <FilterHeader refresh={[refresh, setRefresh]} />
              </Grid>
              <Grid item xs={12}>
                <FilterWrapper>
                  <AccordianFilters
                    toFromDatesHandlers={[setFrom, setTo, addMonths]}
                    sources={[sources, setSources]}
                    languages={[languages, setLanguages]}
                    moods={[moods, setMoods]}
                    sentiments={[sentiments, setSentiments]}
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

export default InfluencerAnalysis;
