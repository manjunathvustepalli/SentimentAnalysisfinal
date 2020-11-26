import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import FilterHeader from "../Filters/FilterHeader";
import FilterWrapper from "../Filters/FilterWrapper";
import AccordianFilters from "../Filters/AccordianFilters";
import {
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import WordCloud from "../charts/WordCloudChart";
import { capitalizeString, getKeyArray } from "../../helpers";
import Axios from "axios";
import { wordCloudSentimentFilter } from "../../helpers/filter";
import { WordCloudFiltersContext } from "../../contexts/WordCloudContext";
import useMountAndUpdateEffect from "../custom Hooks/useMountAndUpdateEffect";
import useDidUpdateEffect from "../custom Hooks/useDidUpdateEffect";
import CustomLegend from "../CustomLegend";
import colors from "../../helpers/colors";
import CloseIcon from "@material-ui/icons/Close";
import TableWithData from "../Tables/TableWithData";
import { Auth, header } from "./Auth";
import Cookies from "js-cookie";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
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
  buttonStyle: {
    border: "1px solid green",
    color: "white",
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: "green",
    },
  },
}));

var sortedData = {};

function WordCloudSentiment() {
  const classes = useStyles();
  const handleTabChange = (event, newValue) => setValue(newValue);
  const wordCloudFilters = useContext(WordCloudFiltersContext);
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
    sentiments,
    setSentiments,
    wordCount,
    setWordCount,
    value,
    setValue,
  } = wordCloudFilters;

  const [refresh, setRefresh] = useState(true);
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  const [tableData, setTableData] = useState([]);
  const searchWordData = () => {
    // Axios.post(

    //     process.env.REACT_APP_SEARCH_URL,
    //   {
    //     query: {
    //       bool: {
    //         must: [{ terms: { "HashtagEntities.Text.keyword": [word] } }],
    //       },
    //     },
    //     size: 50,
    //     sort: [
    //       {
    //         CreatedAt: {
    //           order: "desc",
    //         },
    //       },
    //     ],
    //   },
    //   Auth
    // )
    let data = JSON.stringify({
      queryHashtagEntities: [word],
    });
    let token = Cookies.get("token");
    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "query/search",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };
    Axios(config).then((fetchedData) => {
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
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = (changeInState) => {
    // let query = {
    //     "aggs": {
    //         "date-based-range": {
    //             "date_range": {
    //                 "field": "CreatedAt",
    //                 "format": "dd-MM-yyyy",
    //                 "ranges": [{
    //                     "from": from,
    //                     "to": to
    //                 }]
    //             },
    //             "aggs": {
    //                 "lang": {
    //                     "terms": {
    //                         "field": "predictedLang.keyword"
    //                     },
    //                     "aggs": {
    //                         "Source": {
    //                             "terms": {
    //                                 "field": "Source.keyword"
    //                             },
    //                             "aggs":{
    //                                 "SubSource":{
    //                                     "terms":{
    //                                         "field":"SubSource.keyword"
    //                                     },
    //                                     "aggs":{
    //                                         "Daily-Sentiment-Distro": {
    //                                             "terms": {
    //                                               "field": "predictedSentiment.keyword"
    //                                             },
    //                                             "aggs":{
    //                                                 "Words":{
    //                                                     "terms":{
    //                                                         "field":"HashtagEntities.Text.keyword"
    //                                                     }
    //                                                 }
    //                                             }
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    // if(keywordType === 'Screen Name'){
    //     query["query"] = {
    //         "terms": {
    //           "User.ScreenName.keyword": keywords
    //         }
    //       }
    // } else if (keywordType === 'Hash Tags') {
    //     query["query"] =  {
    //         "terms": {
    //           "HashtagEntities.Text.keyword": keywords
    //         }
    //     }
    // }
    // Axios.post(
    //   process.env.REACT_APP_URL,
    //   query, Auth
    // )
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
    }
    let token = Cookies.get("token");
    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "query/wordcloudanalysis",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };
    Axios(config)
      .then((fetchedData) => {
        var sourceKeys, subSourceKeys, sentimentKeys;
        var uniqueSourceKeys = [];
        var uniqueSubSourceKeys = [];
        let languageBuckets =
          fetchedData.data.aggregations["date-based-range"].buckets[0].lang
            .buckets;
        var languageKeys = getKeyArray(languageBuckets);
        languageKeys.forEach((key, i) => {
          let sourceBuckets = languageBuckets[i].Source.buckets;
          sourceKeys = getKeyArray(sourceBuckets);
          sortedData[key] = {};
          sourceKeys.forEach((source, j) => {
            if (!uniqueSourceKeys.includes(source)) {
              uniqueSourceKeys.push(source);
            }
            sortedData[key][source] = {};
            let subSourceBuckets = sourceBuckets[j].SubSource.buckets;
            subSourceKeys = getKeyArray(subSourceBuckets);
            subSourceKeys.forEach((subSource, k) => {
              if (!uniqueSubSourceKeys.includes(subSource)) {
                uniqueSubSourceKeys.push(subSource);
              }
              sortedData[key][source][subSource] = {};
              let sentimentBuckets =
                subSourceBuckets[k]["Daily-Sentiment-Distro"].buckets;
              sentimentKeys = getKeyArray(sentimentBuckets);
              sentimentKeys.forEach((sentiment, l) => {
                sortedData[key][source][subSource][
                  sentiment
                ] = sentimentBuckets[l].Words.buckets.map((wordObj) => {
                  return {
                    name: wordObj.key,
                    weight: wordObj.doc_count,
                    color: colors[sentiment],
                  };
                });
              });
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
          let availableSourceKeys = {};
          uniqueSourceKeys.forEach((source) => {
            availableSourceKeys[source] = true;
          });
          setSources(availableSourceKeys);

          let availableSubSourceKeys = {};
          uniqueSubSourceKeys.forEach((subSource) => {
            availableSubSourceKeys[subSource] = true;
          });
          setSubSources(availableSubSourceKeys);

          setSentiments((prev) => {
            if (Object.keys(prev).length) {
              return prev;
            } else {
              return { negative: true, positive: true, neutral: true };
            }
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useMountAndUpdateEffect(
    () => {
      fetchData(false);
    },
    () => {
      fetchData(true);
    },
    [from, to, refresh, keywords]
  );

  useDidUpdateEffect(() => {
    if (keywordType === "Entire Data") {
      fetchData(false);
    }
  }, [keywordType]);

  useEffect(() => {
    let temp = wordCloudSentimentFilter(
      sources,
      subSources,
      sentiments,
      sortedData
    );
    Object.keys(temp).forEach((language) => {
      temp[language] = temp[language]
        .sort((a, b) => {
          return b.weight - a.weight;
        })
        .slice(0, wordCount);
    });
    setData(temp);
  }, [sources, subSources, sentiments, wordCount]);

  useDidUpdateEffect(() => {
    searchWordData();
  }, [word]);

  return (
    <>
      <div style={{ backgroundColor: "#F7F7F7", padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item sm={12} md={8}>
            <Typography style={{ color: "#43B02A", fontSize: "30px" }}>
              Word Cloud
            </Typography>
            <Card className={classes.main}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} align="left">
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Word Count
                    </InputLabel>
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
                <Grid item xs={12} sm={6} align="right">
                  {/* <Button
                                        variant="contained"
                                        style={{margin:"10px"}}
                                        component={Link}
                                        to="/word-cloud/mood"
                                    >
                                    Mood
                                </Button> */}
                  <Button
                    variant="contained"
                    style={{ margin: "10px" }}
                    className={classes.buttonStyle}
                    component={Link}
                    to="/word-cloud/sentiment"
                  >
                    Sentiment
                  </Button>
                </Grid>
                <div
                  style={{
                    width: 280 * Object.keys(data).length + "px",
                    marginLeft: "20px",
                  }}
                >
                  <Grid item xs={12} align="right">
                    <Tabs
                      value={value}
                      onChange={handleTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="scrollable"
                      scrollButtons="auto"
                      TabIndicatorProps={{
                        style: { background: "rgb(67, 176, 42)" },
                      }}
                      aria-label="scrollable auto tabs example"
                    >
                      {Object.keys(data).map((lang, i) => (
                        <Tab
                          label={lang}
                          style={{
                            color: value === i && "white",
                            backgroundColor: value === i && "rgb(67, 176, 42)",
                            border: value !== i && "2px solid rgb(67, 176, 42)",
                          }}
                          {...a11yProps(i)}
                        />
                      ))}
                    </Tabs>
                  </Grid>
                </div>
                <Grid item xs={12}>
                  {Object.keys(data).map((lang, i) => {
                    return (
                      <TabPanel value={value} index={i}>
                        <WordCloud
                          clickable
                          setOpen={setOpen}
                          setWord={setWord}
                          data={data[lang]}
                        />
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {["positive", "negative", "neutral"].map(
                            (sentiment) => (
                              <CustomLegend
                                word={capitalizeString(sentiment)}
                                color={colors[sentiment]}
                              />
                            )
                          )}
                        </div>
                      </TabPanel>
                    );
                  })}
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item sm={12} md={4}>
            <Grid
              container
              spacing={1}
              style={{ position: "sticky", top: "60px" }}
            >
              <Grid item xs={12}>
                <FilterHeader refresh={[refresh, setRefresh]} />
              </Grid>
              <Grid item xs={12}>
                <FilterWrapper>
                  <AccordianFilters
                    toFromDatesHandlers={[setFrom, setTo, from, to]}
                    sources={[sources, setSources]}
                    sentiments={[sentiments, setSentiments]}
                    // subSources={[subSources,setSubSources]}
                    setKeywords={setKeywords}
                    keywordTypes={[keywordType, setKeywordType]}
                    keywords={keywords}
                  />
                </FilterWrapper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
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
                {word}
              </Typography>
            </Toolbar>
          </AppBar>
          <TableWithData rows={tableData} />
        </Dialog>
      </div>
    </>
  );
}

export default WordCloudSentiment;
