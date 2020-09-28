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
    setKeywordType,
    sentimentData,
    changeData
} = trendingSubjectsFilters


  const [refresh, setRefresh] = useState(true);
  const [noData, setnoData] = useState(false)
  const classes = useStyles();
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
                      onChange={(e) => {
                        setSentiment(e.target.value)
                        changeData('sentiment',e.target.value)
                      }}
                    >
                      {
                        sentiments.map((sentiment,i) => <MenuItem key={i} value={sentiment} >{sentiment}</MenuItem>)
                      }
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
                  <TrendingSubjectsBarChart title={`Trending subjects of ${language} Language in ${source} of ${subSource} under ${sentiment} sentiment`} y={'frequency'} data={sentimentData} />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item sm={12} md={4}>
            <Grid container spacing={1}style={{position:'sticky',top:'60px'}}>
              <Grid item xs={12}>
                <FilterHeader refresh={[refresh, setRefresh]} />
              </Grid>
              {
                  sources.length && languages.length && noData ? (
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
                    radioSources={[source,setSource,sources,changeData,'source']}
                    radioLanguages={[language,setLanguage,languages,changeData,'language']}
                    AutoCompleteSubSources={[subSource,setSubSource,subSources,changeData,'subSource']}
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
