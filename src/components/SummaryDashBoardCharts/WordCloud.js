import React, { useEffect, useState } from "react";
import {
  Grid,
  makeStyles,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import Axios from "axios";
import { capitalizeString, getKeyArray } from "../../helpers";
import WordCloudChart from "../charts/WordCloudChart";
import CustomLegend from "../CustomLegend";
import colors from "../../helpers/colors";
import { Link } from "react-router-dom";
import useDidUpdateEffect from "../custom Hooks/useDidUpdateEffect";
import { Auth, header } from "../Pages/Auth";
import Cookies from "js-cookie";

var sortedData = {};

function WordCloud({ from, to, keywords, keywordType, refresh }) {
  const [sources, setSources] = useState([]);
  const [source, setSource] = useState(".");
  const [sentiment, setSentiment] = useState("positive");
  const [mood, setMood] = useState("joy");
  const [data, setData] = useState([]);
  const [type, setType] = useState("sentiment");
  const [pages] = useState(JSON.parse(Cookies.get("pages")));
  const [linkAcess, setLinkAccess] = useState(false);
  useEffect(() => {
    pages.map((page) => {
      if (page === "Word Cloud") {
        setLinkAccess(true);
      }
    });
    setData([]);
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
    //                 "Source": {
    //                     "terms": {
    //                         "field": "Source.keyword"
    //                     },
    //                     "aggs": {
    //                         "Daily-Sentiment-Distro": {
    //                             "terms": {
    //                                 "field": "predictedSentiment.keyword"
    //                             },
    //                           "aggs":{
    //                           	   "Words": {
    //                                  	"terms": {
    //                                         "field": "HashtagEntities.Text.keyword"
    //                                         }
    //                                     }
    //                           }
    //                         },
    //                         "Daily-Mood-Distro":{
    //                             "terms": {
    //                                 "field": "predictedMood.keyword"
    //                             },
    //                             "aggs": {
    //                                 "Words": {
    //                                     "terms": {
    //                                         "field": "HashtagEntities.Text.keyword"
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
    // Axios.post(process.env.REACT_APP_URL,query, Auth)

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
      url:
        process.env.REACT_APP_URL +
        "query/wordcloudanalysisforsummarydashboard",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    Axios(config)
      .then((fetchedData) => {
        let sourceBuckets =
          fetchedData.data.aggregations["date-based-range"].buckets[0].Source
            .buckets;
        let sourceKeys = getKeyArray(sourceBuckets);
        sourceKeys.forEach((source, i) => {
          sortedData[source] = {};
          let sentimentBuckets =
            sourceBuckets[i]["Daily-Sentiment-Distro"].buckets;
          let sentimentKeys = getKeyArray(sentimentBuckets);
          sortedData[source].sentiment = {};
          sentimentKeys.forEach((sentiment, j) => {
            let wordBuckets = sentimentBuckets[j].Words.buckets;
            sortedData[source].sentiment[sentiment] = wordBuckets.map(
              (wordObj) => {
                return {
                  name: wordObj.key,
                  weight: wordObj.doc_count,
                  color: colors[sentiment],
                };
              }
            );
          });
          let moodBuckets = sourceBuckets[i]["Daily-Mood-Distro"].buckets;
          let moodKeys = getKeyArray(moodBuckets);
          sortedData[source].mood = {};
          moodKeys.forEach((mood, k) => {
            let wordBuckets = moodBuckets[k].Words.buckets;
            sortedData[source].mood[mood] = wordBuckets.map((wordObj) => {
              return {
                name: wordObj.key,
                weight: wordObj.doc_count,
                color: colors[mood],
              };
            });
          });
        });
        setSources(sourceKeys);
        setSource(sourceKeys[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [to, from, keywords, keywordType]);

  useDidUpdateEffect(() => {
    setData((prev) => {
      try {
        if (type === "sentiment") {
          return sortedData[source].sentiment[sentiment];
        } else {
          return sortedData[source].mood[mood];
        }
      } catch (err) {
        console.log(err);
        return [];
      }
    });
  }, [source, sentiment, mood, type]);

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={3}
        style={{ height: "70px", lineHeight: "70px", padding: "10px 0 0 20px" }}
      >
        Word Cloud
      </Grid>
      <Grid item xs={9}>
        {sources && sources.length && (
          <Grid container spacing={2} style={{ marginTop: "10px" }}>
            <Grid item xs={4}>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <InputLabel id="select-source">Source</InputLabel>
                <Select
                  labelId="select-source"
                  id="select-source-main"
                  variant="outlined"
                  style={{ fontSize: "7px", height: "30px" }}
                  label="Source"
                  fullWidth
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  {sources &&
                    sources.length &&
                    sources.map((source, i) => (
                      <MenuItem value={source} key={i}>
                        {source}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <InputLabel id="Select-type">Type </InputLabel>
                <Select
                  labelId="Select-type"
                  id="select-type-main"
                  style={{ fontSize: "7px", height: "30px" }}
                  fullWidth
                  label="Type"
                  variant="outlined"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value={"sentiment"}>Sentiment</MenuItem>
                  <MenuItem value={"mood"}>Mood</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              {type === "sentiment" ? (
                <FormControl variant="outlined" style={{ width: "90%" }}>
                  <InputLabel id="sentiment-select">Sentiment </InputLabel>
                  <Select
                    labelId="sentiment-select"
                    id="sentiment-select-main"
                    fullWidth
                    style={{ fontSize: "7px", height: "30px" }}
                    label="Sentiment"
                    value={sentiment}
                    onChange={(e) => setSentiment(e.target.value)}
                  >
                    <MenuItem value={"negative"}>Negative</MenuItem>
                    <MenuItem value={"positive"}>Positive</MenuItem>
                    <MenuItem value={"neutral"}>Neutral</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <FormControl variant="outlined" style={{ width: "90%" }}>
                  <InputLabel id="select-mood">Mood </InputLabel>
                  <Select
                    labelId="select-mood"
                    id="select-mood-main"
                    fullWidth
                    style={{ fontSize: "7px", height: "30px" }}
                    label="Mood"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    <MenuItem value={"joy"}>Joy</MenuItem>
                    <MenuItem value={"anticipation"}>Anticipation</MenuItem>
                    <MenuItem value={"surprise"}>Surprise</MenuItem>
                    <MenuItem value={"anger"}>Anger</MenuItem>
                    <MenuItem value={"trust"}>Trust</MenuItem>
                    <MenuItem value={"fear"}>Fear</MenuItem>
                    <MenuItem value={"sad"}>Sad</MenuItem>
                    <MenuItem value={"disgust"}>Disgust</MenuItem>
                    <MenuItem value={"neutral"}>neutral</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
      {linkAcess ? (
        <Link style={{ width: "100%" }} to="/word-cloud/sentiment">
          <Grid item xs={12}>
            <WordCloudChart
              title={`${capitalizeString(source)}  ${
                type === "sentiment"
                  ? capitalizeString(sentiment)
                  : capitalizeString(mood)
              } ${capitalizeString(type)} Word Cloud`}
              data={data}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CustomLegend
                color={type === "sentiment" ? colors[sentiment] : colors[mood]}
                word={
                  type === "sentiment"
                    ? capitalizeString(sentiment)
                    : capitalizeString(mood)
                }
              />
            </div>
          </Grid>
        </Link>
      ) : (
        <Grid item xs={12}>
          <WordCloudChart
            title={`${capitalizeString(source)}  ${
              type === "sentiment"
                ? capitalizeString(sentiment)
                : capitalizeString(mood)
            } ${capitalizeString(type)} Word Cloud`}
            data={data}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CustomLegend
              color={type === "sentiment" ? colors[sentiment] : colors[mood]}
              word={
                type === "sentiment"
                  ? capitalizeString(sentiment)
                  : capitalizeString(mood)
              }
            />
          </div>
        </Grid>
      )}
    </Grid>
  );
}

export default WordCloud;
