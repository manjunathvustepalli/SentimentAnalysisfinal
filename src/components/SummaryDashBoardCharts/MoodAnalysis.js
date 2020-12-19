import React, { useEffect, useState } from "react";
import TrendAnalysisLineChart from "../charts/TrendAnalysisLineChart";
import Axios from "axios";
import colors from "../../helpers/colors";
import { Link } from "react-router-dom";
import { Auth, header } from "../Pages/Auth";
import Cookies from "js-cookie";

function MoodAnalysis({ toFromDateHandlers, keywords, keywordType, refresh }) {
  const [pages] = useState(JSON.parse(Cookies.get("pages")));
  const [linkAcess, setLinkAccess] = useState(false);
  const [from, to] = toFromDateHandlers;
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    pages.map((page)=>{
    if(page==="Mood Analysis"){

      setLinkAccess(true)
    }})
    setData([]);
    setDates([]);
    // let query = {
    //   "aggs": {
    //     "date-based-range": {
    //       "date_range": {
    //         "field": "CreatedAt",
    //         "format": "dd-MM-yyyy",
    //         "ranges": [
    //           { "from": from,"to": to }
    //         ]
    //       },
    //         "aggs": {
    //           "per-day": {
    //             "date_histogram": {
    //                 "field": "CreatedAt",
    //                 "format": "yyyy-MM-dd",
    //                 "calendar_interval": "day"
    //             },
    //           "aggs": {
    //             "Daily-Sentiment-Distro": {
    //               "terms": {
    //                 "field": "predictedMood.keyword"
    //               }
    //             }
    //           }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   if(keywordType === 'Screen Name'){
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
    // Axios.post(process.env.REACT_APP_URL,
    //     query, Auth)

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
      url: process.env.REACT_APP_URL + "query/moodanalysisforsummarydashboard",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    Axios(config)
      .then((fetchedData) => {
        let perDayBuckets =
          fetchedData.data.aggregations["date-based-range"].buckets[0][
            "per-day"
          ].buckets;
        let perDayKeys = perDayBuckets.map((keyObj) => keyObj.key_as_string);
        let sortedData = [];
        let moods = [
          "joy",
          "anticipation",
          "surprise",
          "anger",
          "disgust",
          "fear",
          "sad",
          "trust",
          "neutral"
        ];
        moods.forEach((mood, i) => {
          sortedData.push({
            name: mood,
            color: colors[mood],
            data: perDayBuckets.map((day) => {
              let sentiBuckets = day["Daily-Sentiment-Distro"].buckets;
              for (var j = 0; j < sentiBuckets.length; j++) {
                if (sentiBuckets[j].key === mood) {
                  return sentiBuckets[j].doc_count;
                }
              }
              return 0;
            }),
          });
        });
        setData(sortedData);
        setDates(perDayKeys);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [from, to, keywords, keywordType, refresh]);

  return (
    <>
      {linkAcess ? (
        <Link to="/mood-analysis/line-chart" style={{ width: "100%" }}>
          <div>
            <TrendAnalysisLineChart
              title="Date wise Mood Trend"
              dates={dates}
              data={data}
              height={"400px"}
            />
          </div>
        </Link>
      ) : (
        <div>
          <TrendAnalysisLineChart
            title="Date wise Mood Trend"
            dates={dates}
            data={data}
            height={"400px"}
          />
        </div>
      )}
    </>
  );
}

export default MoodAnalysis;
