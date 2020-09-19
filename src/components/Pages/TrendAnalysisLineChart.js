import React, { useState } from "react";
import SideNav from "../Navigation/SideNav";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import FilterWrapper from "../Filters/FilterWrapper";
import AccordianFilters from "../Filters/AccordianFilters";
import FilterHeader from "../Filters/FilterHeader";
import { addMonths, getKeyArray } from "../../helpers";
import TabbarMUI from "./TabbarMUI";
import { useEffect } from "react";
import Axios from "axios";
import { trendAnalysisBarGraphFilter, TrendAnalysisLineChartFilter } from "../../helpers/filter";
import LineChart from "../charts/TrendAnalysisLineChart"
import { Redirect } from "react-router-dom";

var sortedData = {}

function TrendAnalysisLineChart() {
  const [refresh, setRefresh] = useState(true);
  const [sources, setSources] = useState({});
  const [languages, setLanguages] = useState({});
  const [from, setFrom] = useState(addMonths(new Date(), -1));
  const [to, setTo] = useState(addMonths(new Date(), 0));
  const [barData, setBarData] = useState([[],[]])
  const [lineData, setLineData] = useState([])
  const [chartType, setChartType] = useState('line')

  const useStyles = makeStyles((theme) => ({
    main: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#CB0038",
    },
    formControl: {
      margin: "20px",
      fullWidth: true,
      display: "flex",
      wrap: "nowrap",
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
    tabbar: {
      marginBottom: "20px !important",
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    Axios.post(process.env.REACT_APP_URL,{
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
            "per-day": {
              "date_histogram": {
                "field": "CreatedAt",
                "calendar_interval": "day"
              },
              "aggs": {
                "Source": {
                  "terms": {
                    "field": "Source.keyword"
                  },
                  "aggs": {
                    "Lang": {
                      "terms": {
                          "field": "predictedLang.keyword"
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
      sortedData = {}
      var sourceKeys,languageKeys
      var uniqueSourceKeys = []
      var uniqueLanguageKeys = []
      var perDayBucket =  fetchedData.data.aggregations['date-based-range'].buckets[0]['per-day'].buckets
      var perDayKeys =  perDayBucket.map(key => key.key_as_string.split('T')[0])
      perDayKeys.forEach((dayKey,i) => {
        sortedData[dayKey] = {}
        let sourceBuckets = perDayBucket[i].Source.buckets
        sourceKeys = getKeyArray(sourceBuckets)
        sourceKeys.forEach((source,j) => {
          if(!uniqueSourceKeys.includes(source)){
            uniqueSourceKeys.push(source)
          }
          sortedData[dayKey][source] = {}
          let languageBuckets = sourceBuckets[j].Lang.buckets
          languageKeys = getKeyArray(languageBuckets)
          languageKeys.forEach((language,k)=>{
            if(!uniqueLanguageKeys.includes(language)){
              uniqueLanguageKeys.push(language)
            }
            sortedData[dayKey][source][language] = languageBuckets[k].doc_count
          })
        })
      })
      let availableSourceKeys = {}
      uniqueSourceKeys.forEach(source =>{
          availableSourceKeys[source] = true
      })
      setSources(availableSourceKeys)

      let availableLanguageKeys = {}
      uniqueLanguageKeys.forEach(lang =>{
          availableLanguageKeys[lang] = true
      })
      setLanguages(availableLanguageKeys)
    })
    .catch(err=>{
      console.log(err)
    })
  }, [from,to,refresh])

  useEffect(()=>{
    setBarData((prev) => {
      let data = trendAnalysisBarGraphFilter(languages,sources,sortedData)
      return data
    })
  },[languages,sources])

  useEffect(() => {
    let temp = TrendAnalysisLineChartFilter(languages,sources,sortedData)
    if(temp){
      setLineData(temp)
    }
  },[languages,sources])

  return (
    <>
        {chartType === 'area' && <Redirect to="/trend-analysis/area-chart" />}
        {chartType === 'stack' && <Redirect to="/trend-analysis/stacked-bar-chart" />}
        {chartType === 'bar' && <Redirect to="/trend-analysis/bar-chart" />}
        {chartType === 'pie' && <Redirect to="/trend-analysis/pie-chart" />}
        {chartType === 'semi-pie' && <Redirect to="/trend-analysis/semi-pie-chart" />} 

      <div style={{ backgroundColor: "#F7F7F7", padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item md={8} sm={12}>
          <Typography style={{ color: "#43B02A", fontSize: "30px" }}>
            Trend Analysis
          </Typography>
            <Card className={classes.main}>
              <Grid container spacing={3}>
                <Grid item md={7} sm={6}>
                  <CardContent>Source wise Trend of Posts</CardContent>
                </Grid>
                <Grid item md={5} sm={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Change Chart Type</InputLabel>
                    <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                label="Change Chart Type"
                                value={chartType}
                                onChange={(e) => setChartType(e.target.value)}
                            >
                          <MenuItem value={'bar'}>Bar chart</MenuItem>
                          <MenuItem value={'stack'}>Stacked Bar chart</MenuItem>                            
                          <MenuItem value={'area'}>Area chart</MenuItem>                            
                          <MenuItem value={'line'}>Line chart</MenuItem>                            
                          <MenuItem value={'pie'}>Pie chart</MenuItem>                            
                          <MenuItem value={'semi-pie'}>Semi Pie chart</MenuItem>                          
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <LineChart data={barData[0]} dates={barData[1]} />
                </Grid>
                <Grid item xs={11}>
                    <TabbarMUI className={classes.tabbar} data={lineData} />
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
                    toFromDatesHandlers={[setFrom, setTo,from,to]}
                    sources={[sources, setSources]}
                    languages={[languages, setLanguages]}
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

export default TrendAnalysisLineChart;
