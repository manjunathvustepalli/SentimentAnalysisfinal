import React, { useState, useEffect } from "react";
import {
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import MaterialTable from "material-table";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import LaunchIcon from "@material-ui/icons/Launch";
import { getKeyArray } from "../../helpers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Slide from "@material-ui/core/Slide";
import Image from "material-ui-image";
import { Tweet } from "react-twitter-widgets";
import { Auth } from "./Auth";
import Cookies from "js-cookie";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import GridListTile from "@material-ui/core/GridListTile";
import EditIcon from "@material-ui/icons/Edit";
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

const useStyles = makeStyles((theme) => ({
  root: {
    background: "rgb(67, 176, 42)",
    color: "white",
    height: "auto",
    margin: "10px",
    fontSize: "10px",
    padding: "10px",
    "&:hover": {
      background: "rgb(67, 176, 42)",
      color: "white",
      height: "auto",
      margin: "10px",
      fontSize: "10px",
      padding: "10px",
    },
  },
  formControl: {
    fullWidth: true,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
    color: "white",
    textAlign: "center",
    backgroundColor: "rgb(67, 176, 42)",
    "&:hover": {
      backgroundColor: "rgb(67, 176, 42)",
    },
  },
}));
var sortedData = {};

function LiveAnalysis() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [liveReloading, setLiveReloading] = useState(false);
  const [reloadInterval, setReloadInterval] = useState(10000);
  const [to] = useState(new Date());
  const [from] = useState(new Date());
  const [actualUrl, setactualUrl] = useState("");
  const [languages, setLanguages] = useState(["english"]);
  const [source, setSource] = useState("twitter");
  const [dataObject, setDataObject] = useState({});
  const [sentiment, setsentiment] = useState([]);

  const [columns, setColumns] = useState([
    { title: "Name", field: "name" },
    { title: "Screen Name", field: "screenName" },
    { title: "Post", field: "tweet" },
    { title: "Followers Count", field: "followersCount" },
    { title: "Retweet Count", field: "retweetCount" },
    { title: "Mood", field: "mood" },
    { title: "Sentiment", field: "sentiment" },
  ]);
  const [open, setOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("image");
  const [content, setContent] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState([]);
  const [editsentiment, setEditSentiment] = useState("");
  const [editMood, setEditMood] = useState("");
  const [editlanguage, setEditLanguage] = useState("");
  const [imageSentiment1, setImageSentiment1] = useState([]);
  const [imageSentiment2, setImageSentiment2] = useState([]);
  const [image1, setImage1] = useState([]);
  const [imageCorrection, setimageCorrections] = useState([]);
  const handleEditClose = () => {
    setEditLanguage("");
    setEditMood("");
    setEditSentiment("");
    setEditOpen(false);
  };
  const setEditimageSentiment = (i) => (e) => {
    console.log(i, e.target.value);
    let newArr = [...imageSentiment1];
    newArr[i] = e.target.value;
    setImageSentiment1(newArr);
    
  };
  const handleEditData = async (rowData) => {
    console.log(rowData);
    let isentiment = [];
    let image = [];
    if (rowData.pimageSentiment) {
      rowData.pimageSentiment.map((post, i) => {
        isentiment.push(post.sentiment);
        image.push(post.externalURL);
      });
    }
    setImageSentiment1(isentiment);
    setImageSentiment2(isentiment);

    setImage1(image);
    setEditData(rowData);
    setEditSentiment(rowData.sentiment);
    setEditMood(rowData.mood);
    setEditLanguage(rowData.language);

    setEditOpen(true);
  };
  const updatedata = async() => {
    let imagecorrection = [];
    let image = {};
    await image1.map(
      (image, i) => (
        (image = {
          imageUrl: image,
          newPredictedSentiment: imageSentiment1[i],
          oldPredictedSentiment: imageSentiment2[i],
        }),
        imagecorrection.push(image)
      )
    );
    console.log(imagecorrection);
    handleEditClose(false);
    let token = Cookies.get("token");
    let data = "";
    if (source !== "newspaper") {
      data = JSON.stringify({
        predictedRecordForUpdate: {
          id: editData.id,
          text: editData.tweet,
          oldPredictedLanguage: editData.language,
          newPredictedLanguage: editlanguage,
          oldPredictedSentiment: editData.sentiment,
          newPredictedSentiment: editsentiment,
          oldPredictedMood: editData.mood,
          newPredictedMood: editMood,
          imageCorrections: imagecorrection,
        },
      });
    } else {
      data = JSON.stringify({
        predictedRecordForUpdate: {
          id: editData.id,
          textBody: editData.tweet,
          oldPredictedLanguage: editData.language,
          newPredictedLanguage: editlanguage,
          oldPredictedSentiment: editData.sentiment,
          newPredictedSentiment: editsentiment,
          oldPredictedMood: editData.mood,
          newPredictedMood: editMood,
          imageCorrections: imagecorrection,
        },
      });
    }

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "query/updatedata",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    Axios(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleClose = () => {
    setOpen(false);
    setsentiment("");
  };
  function fetchData(param) {
    // Axios.post(

    //     process.env.REACT_APP_SEARCH_URL,
    //   {
    //     query: {
    //       bool: {
    //         must: [
    //           {
    //             terms: {
    //               "Source.keyword": [source],
    //             },
    //           },
    //           {
    //             terms: {
    //               "predictedLang.keyword": languages,
    //             },
    //           },
    //         ],
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
    let token = Cookies.get("token");
    let editDataAcess = Cookies.get("Update Data");
    let data = "";
    if (param === "queryFirstTime") {
      data = JSON.stringify({
        querySources: [source],
        queryLanguages: languages,
        queryFirstTime: "true",
      });
    } else {
      data = JSON.stringify({
        querySources: [source],
        queryLanguages: languages,
        queryFirstTime: "false",
      });
    }

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
        console.log("live analysis", fetchedData);
        let final = fetchedData.data.hits.hits.map((user) => {
          let obj = {};
          obj.id = user._id;
          if (user._source.User) {
            obj.name = user._source.User.Name;
            obj.screenName = user._source.User.ScreenName;
            obj.followersCount = user._source.User.FollowersCount;
          }
          if (user._source.SubSource) {
            obj.SubSource = user._source.SubSource;
          }
          if (user._source.Place) {
            obj.location = user._source.Place.FullName;
          }
          if (user._source.predictedLang) {
            obj.language = user._source.predictedLang;
          }
          if (user._source.HashtagEntities) {
            obj.hashTags = user._source.HashtagEntities.map((hashTag) => (
              <Chip
                label={hashTag.Text}
                size="small"
                style={{
                  margin: "5px",
                  backgroundColor: "rgb(67,176,42)",
                  color: "white",
                }}
              />
            ));
          }
          if (user._source.PredictedImageSentiment) {
            // console.log(user._source.PredictedImageSentiment);
            obj.pimageSentiment = user._source.PredictedImageSentiment;
            obj.predictedSentiment = user._source.PredictedImageSentiment.map(
              (image) =>
                image.sentiment === "neutral" ? (
                  <Chip
                    label={image.sentiment}
                    size="small"
                    style={{
                      margin: "5px",
                      backgroundColor: "#424242",
                      color: "white",
                    }}
                  />
                ) : image.sentiment === "positive" ? (
                  <Chip
                    label={image.sentiment}
                    size="small"
                    style={{
                      margin: "5px",
                      backgroundColor: "rgb(67,176,42)",
                      color: "white",
                    }}
                  />
                ) : (
                  <Chip
                    label={image.sentiment}
                    size="small"
                    style={{
                      margin: "5px",
                      backgroundColor: "#ff1744",
                      color: "white",
                    }}
                  />
                )
            );
          }
          if (user._source.MediaEntities && user._source.MediaEntities.length) {
            obj.mediaUrl = user._source.MediaEntities.map((post, i) => {
              // console.log("mediaurl",post)
              return (
                <IconButton
                  className={classes.root}
                  onClick={() => {
                    setOpen(true);
                    setType("image");
                    if (post.MediaURLHttps) {
                      setactualUrl(post.MediaURLHttps);
                      setImageUrl(post.MediaURLHttps);
                      if (user._source.PredictedImageSentiment) {
                        setsentiment(user._source.PredictedImageSentiment[i]);
                      }
                    } else {
                      setactualUrl(post.MediaURL);
                      setImageUrl(post.MediaURL);
                      if (user._source.PredictedImageSentiment) {
                        setsentiment(user._source.PredictedImageSentiment[i]);
                      }
                    }
                  }}
                >
                  <LaunchIcon />
                </IconButton>
              );
            });
            if (user._source.MediaEntities[0].ExpandedURL) {
              // console.log("post", user._source.MediaEntities[0].ExpandedURL);
              obj.postUrl = (
                <IconButton
                  onClick={() => {
                    setOpen(true);
                    setType("post");
                    let splittedUrl = user._source.MediaEntities[0].ExpandedURL.split(
                      "/photo"
                    )[0].split("/");
                    let id = splittedUrl[splittedUrl.length - 1];
                    setContent(id);
                    setactualUrl(user._source.MediaEntities[0].ExpandedURL);
                  }}
                  className={classes.root}
                >
                  {" "}
                  <LaunchIcon />{" "}
                </IconButton>
              );
            }
          } else if (user._source.URLEntities && source !== "twitter") {
            if (user._source.URLEntities[0]) {
              obj.postUrl = (
                <IconButton
                  onClick={() => {
                    setOpen(true);
                    setType("post");
                    setContent(user._source.URLEntities[0].URL);
                    setactualUrl(user._source.URLEntities[0].URL);
                  }}
                  className={classes.root}
                >
                  {" "}
                  <LaunchIcon />{" "}
                </IconButton>
              );
            }
          }

          obj.date = dateFormatter(user._source.CreatedAt);
          obj.tweet = user._source.Text;
          obj.retweetCount = user._source.RetweetCount;
          obj.mood = user._source.predictedMood;
          obj.sentiment = user._source.predictedSentiment;
          // obj.mediaSentiment = user._source.predictedSentiment;
          obj.language = user._source.predictedLang;
          return obj;
        });
        setData(final);
        if (source === "twitter") {
          if (editDataAcess === "true") {
            setColumns([
              { title: "Date", field: "date" },
              { title: "Name", field: "name" },
              { title: "Screen Name", field: "screenName" },
              { title: "Post", field: "tweet" },
              { title: "Mood", field: "mood" },
              { title: "Sub Source", field: "SubSource" },
              { title: "Sentiment", field: "sentiment" },
              { title: "Location", field: "location" },
              { title: "HashTags", field: "hashTags" },
              {
                title: "Followers Count",
                field: "followersCount",
                width: "1%",
                cellStyle: { whiteSpace: "nowrap" },
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Retweet Count",
                field: "retweetCount",
                width: "1%",
                cellStyle: { whiteSpace: "nowrap" },
                headerStyle: { whiteSpace: "nowrap" },
              },
              { title: "Media Sentiment", field: "predictedSentiment" },
              {
                title: "Media",
                field: "mediaUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Post",
                field: "postUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Language",
                field: "language",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },

              {
                title: "Suggest Corrections",
                editable: "never",
                render: (rowData) => (
                  <Button
                    onClick={() => {
                      handleEditData(rowData);
                    }}
                  >
                    <EditIcon />
                  </Button>
                ),
              },
            ]);
          } else {
            setColumns([
              { title: "Date", field: "date" },
              { title: "Name", field: "name" },
              { title: "Screen Name", field: "screenName" },
              { title: "Sub Source", field: "SubSource" },
              { title: "Post", field: "tweet" },
              { title: "Mood", field: "mood" },
              { title: "Sentiment", field: "sentiment" },
              { title: "Location", field: "location" },
              { title: "HashTags", field: "hashTags" },
              {
                title: "Followers Count",
                field: "followersCount",
                width: "1%",
                cellStyle: { whiteSpace: "nowrap" },
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Retweet Count",
                field: "retweetCount",
                width: "1%",
                cellStyle: { whiteSpace: "nowrap" },
                headerStyle: { whiteSpace: "nowrap" },
              },
              { title: "Media Sentiment", field: "predictedSentiment" },
              {
                title: "Media",
                field: "mediaUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Post",
                field: "postUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Language",
                field: "language",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
            ]);
          }
        } else if (source === "instagram" || "facebook") {
          if (editDataAcess === "true") {
            setColumns([
              { title: "Date", field: "date" },
              { title: "Post", field: "tweet" },
              { title: "Mood", field: "mood" },
              { title: "Sub Source", field: "SubSource" },
              { title: "Sentiment", field: "sentiment" },
              {
                title: "Replies",
                field: "retweetCount",
                width: "1%",
                cellStyle: { whiteSpace: "nowrap" },
                headerStyle: { whiteSpace: "nowrap" },
              },
              { title: "Media Sentiment", field: "predictedSentiment" },
              {
                title: "Media",
                field: "mediaUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Post",
                field: "postUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Language",
                field: "language",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Suggest Corrections",
                editable: "never",
                render: (rowData) => (
                  <Button
                    onClick={() => {
                      handleEditData(rowData);
                    }}
                  >
                    <EditIcon />
                  </Button>
                ),
              },
            ]);
          } else {
            setColumns([
              { title: "Date", field: "date" },
              { title: "Post", field: "tweet" },
              { title: "Sub Source", field: "SubSource" },
              { title: "Mood", field: "mood" },
              { title: "Sentiment", field: "sentiment" },
              {
                title: "Replies",
                field: "retweetCount",
                width: "1%",
                cellStyle: { whiteSpace: "nowrap" },
                headerStyle: { whiteSpace: "nowrap" },
              },
              { title: "Media Sentiment", field: "predictedSentiment" },
              {
                title: "Media",
                field: "mediaUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Post",
                field: "postUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Language",
                field: "language",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
            ]);
          }
        } else if (source === "newspaper") {
          if (editDataAcess === "true") {
            setColumns([
              { title: "Date", field: "date" },
              { title: "Post", field: "tweet" },
              { title: "Sub Source", field: "SubSource" },
              { title: "Mood", field: "mood" },
              { title: "Sentiment", field: "sentiment" },
              { title: "Media Sentiment", field: "predictedSentiment" },
              {
                title: "Media",
                field: "mediaUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Post",
                field: "postUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Language",
                field: "language",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Suggest Corrections",
                editable: "never",
                render: (rowData) => (
                  <Button
                    onClick={() => {
                      handleEditData(rowData);
                    }}
                  >
                    <EditIcon />
                  </Button>
                ),
              },
            ]);
          } else {
            setColumns([
              { title: "Date", field: "date" },
              { title: "Post", field: "tweet" },
              { title: "Sub Source", field: "SubSource" },
              { title: "Mood", field: "mood" },
              { title: "Sentiment", field: "sentiment" },
              { title: "Media Sentiment", field: "predictedSentiment" },
              {
                title: "Media",
                field: "mediaUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Post",
                field: "postUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "Language",
                field: "language",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
            ]);
          }
        }
      })
      .catch((err) => {
        console.log(err.response, err);
      });
  }
  useEffect(() => {
    fetchData("queryFirstTime");
    const interval = setInterval(() => {
      if (liveReloading) {
        fetchData("");
      }
    }, reloadInterval);
    return () => clearInterval(interval);
  }, [reloadInterval, liveReloading, from, to, source, languages]);

  useEffect(() => {
    // Axios.post(
    //   process.env.REACT_APP_URL,
    //   {
    //     aggs: {
    //       Source: {
    //         terms: {
    //           field: "Source.keyword",
    //         },
    //         aggs: {
    //           Lang: {
    //             terms: {
    //               field: "predictedLang.keyword",
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },Auth
    // )
    let token = Cookies.get("token");
    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "query/listsources",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: "",
    };

    Axios(config)
      .then((data) => {
        let sourceBuckets = data.data.aggregations.Source.buckets;
        let sourceKeys = getKeyArray(sourceBuckets);
        sourceKeys.forEach((source, i) => {
          sortedData[source] = getKeyArray(sourceBuckets[i].Lang.buckets);
        });
        setDataObject(sortedData);
        // console.log("MyData:", sourceBuckets);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "#F7F7F7", padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Grid container>
              <Grid
                item
                xs={4}
                sm={3}
                md={2}
                lg={2}
                onClick={() => setSource("twitter")}
                style={{
                  backgroundColor: source === "twitter" ? "rgb(67,176,42)" : "",
                  cursor: "pointer",
                  border: "2px solid rgb(67,176,42)",
                  color: source === "twitter" ? "white" : "black",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                TWITTER
              </Grid>
              <Grid
                item
                xs={4}
                sm={3}
                md={2}
                lg={2}
                onClick={() => setSource("instagram")}
                style={{
                  backgroundColor:
                    source === "instagram" ? "rgb(67,176,42)" : "",
                  cursor: "pointer",
                  border: "2px solid rgb(67,176,42)",
                  color: source === "instagram" ? "white" : "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                INSTAGRAM
              </Grid>
              <Grid
                item
                xs={4}
                sm={3}
                md={2}
                lg={2}
                onClick={() => setSource("facebook")}
                style={{
                  backgroundColor:
                    source === "facebook" ? "rgb(67,176,42)" : "",
                  cursor: "pointer",
                  border: "2px solid rgb(67,176,42)",
                  color: source === "facebook" ? "white" : "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                FACEBOOK
              </Grid>
              <Grid
                item
                xs={4}
                sm={3}
                md={2}
                lg={2}
                onClick={() => setSource("newspaper")}
                style={{
                  backgroundColor:
                    source === "newspaper" ? "rgb(67,176,42)" : "",
                  cursor: "pointer",
                  border: "2px solid rgb(67,176,42)",
                  color: source === "newspaper" ? "white" : "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                NEWSPAPER
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={2}></Grid>
          <Grid item xs={3} align="left">
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={liveReloading}
                  onChange={(e) => setLiveReloading(e.target.checked)}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label="Live Reload"
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={1} align="left" />
          <Grid item xs={4} align="left">
            {Object.keys(dataObject).length ? (
              <div style={{ width: "100%" }}>
                <Autocomplete
                  multiple
                  fullWidth
                  id="tags-outlined"
                  value={languages}
                  onChange={(e, arr) => {
                    if (arr.includes("All")) {
                      setLanguages([...dataObject[source]]);
                    } else {
                      setLanguages(arr);
                    }
                  }}
                  options={[...dataObject[source], "All"]}
                  getOptionLabel={(option) => option}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      variant="outlined"
                      label="Select Languages"
                      placeholder="Languages"
                    />
                  )}
                />
              </div>
            ) : (
              ""
            )}
          </Grid>
          <Grid item align={"right"} xs={2} />
          <Grid item xs={2}>
            {liveReloading && (
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Reload Interval
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={reloadInterval}
                  onChange={(e) => setReloadInterval(e.target.value)}
                  label="Reload Interval "
                >
                  <MenuItem value={10000}>10 Seconds</MenuItem>
                  <MenuItem value={20000}>20 Seconds</MenuItem>
                  <MenuItem value={30000}>30 Seconds</MenuItem>
                </Select>
              </FormControl>
            )}
          </Grid>
          <Grid item xs={12}>
            <MaterialTable
              title="Live Analysis"
              columns={columns}
              data={data}
              options={{
                grouping: !liveReloading,
                paging: false,
                maxBodyHeight: 600,
                headerStyle: {
                  backgroundColor: "rgb(67, 176, 42)",
                  color: "white",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                },
              }}
            />
          </Grid>
          {/* <div style={{width:'26vw',padding:'20px'}}  >
                    <Grid container spacing={3} style={{position:'sticky',top:'60px'}} >
                        <Grid item xs={12} >
                            <FilterHeader refresh={[refresh,setRefresh]}/>
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters 
                                    sources={[sources,setSources]} 
                                    languages={[languages,setLanguages]} 
                                    subSources={[subSources,setSubSources]}
                                />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </div> */}
        </Grid>
        <Dialog
          fullWidth
          style={{ height: "700px" }}
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle
            style={{ background: "rgb(67,176,42)", color: "white" }}
            id="alert-dialog-slide-title"
          >
            {" "}
            {type === "image" ? "Image" : "Post"}{" "}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {type === "image" ? (
                <>
                  {" "}
                  <GridListTile>
                    <Image src={imageUrl} style={{ width: "100%" }} />
                    <GridListTileBar
                      subtitle={
                        <>
                          <span>
                            <br></br>CONFIDENCE: {sentiment.confidence}
                          </span>
                        </>
                      }
                      actionIcon={
                        <IconButton
                          aria-label={`info about `}
                          className={classes.icon}
                        >
                          {sentiment.sentiment === "positive" ? (
                            <Chip
                              size="small"
                              label="Positive"
                              style={{ backgroundColor: "#008000" }}
                            />
                          ) : sentiment.sentiment === "negative" ? (
                            <Chip
                              size="small"
                              label="Negative"
                              style={{ backgroundColor: "#FF0000" }}
                            />
                          ) : (
                            <Chip
                              size="small"
                              label={sentiment.sentiment}
                              color="#FF0000"
                            />
                          )}
                        </IconButton>
                      }
                    />
                  </GridListTile>
                </>
              ) : source === "twitter" ? (
                <Tweet
                  style={{ width: "100%", height: "70vh" }}
                  tweetId={content}
                />
              ) : (
                <iframe
                  border={0}
                  frameborder={0}
                  style={{ width: "500px", height: "70vh" }}
                  sandbox=""
                  title={"post"}
                  src={content}
                ></iframe>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <a
              href={actualUrl}
              style={{ textDecoration: "none" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className={classes.root}>Visit</Button>
            </a>
            <Button className={classes.root} onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          fullWidth
          style={{ height: "700px" }}
          open={editOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleEditClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle
            style={{ background: "rgb(67,176,42)", color: "white" }}
            id="alert-dialog-slide-title"
          >
            Edit
          </DialogTitle>
          <DialogContent>
            {imageSentiment1.map((sentiment, i) => (
              <FormControl required fullWidth className={classes.formControl}>
                <InputLabel id="demo-simple-select-required-label">
                  Image Sentiment
                </InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  value={sentiment}
                  onChange={setEditimageSentiment(i)}
                  // className={classes.selectEmpty}
                >
                  <MenuItem value={"positive"}>Positive</MenuItem>
                  <MenuItem value={"negative"}>Negative</MenuItem>
                  <MenuItem value={"neutral"}>Neutral</MenuItem>
                </Select>
              </FormControl>
            ))}
            <FormControl required fullWidth className={classes.formControl}>
              <InputLabel id="demo-simple-select-required-label">
                Language
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={editlanguage}
                onChange={(event) => setEditLanguage(event.target.value)}
                // className={classes.selectEmpty}
              >
                <MenuItem value={"english"}>english</MenuItem>
                <MenuItem value={"bengali"}>bengali</MenuItem>
                <MenuItem value={"banglish"}>banglish</MenuItem>
              </Select>
            </FormControl>
            <FormControl required fullWidth className={classes.formControl}>
              <InputLabel id="demo-simple-select-required-label">
                Sentiment
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={editsentiment}
                onChange={(event) => setEditSentiment(event.target.value)}
                // className={classes.selectEmpty}
              >
                <MenuItem value={"positive"}>Positive</MenuItem>
                <MenuItem value={"negative"}>Negative</MenuItem>
                <MenuItem value={"neutral"}>Neutral</MenuItem>
              </Select>
            </FormControl>
            <FormControl required fullWidth className={classes.formControl}>
              <InputLabel id="demo-simple-select-required-label">
                Mood
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={editMood}
                onChange={(event) => setEditMood(event.target.value)}
                // className={classes.selectEmpty}
              >
                <MenuItem value={"joy"}>joy</MenuItem>
                <MenuItem value={"fear"}>fear</MenuItem>
                <MenuItem value={"sad"}>sad</MenuItem>
                <MenuItem value={"trust"}>trust</MenuItem>
                <MenuItem value={"anticipation"}>anticipation</MenuItem>
                <MenuItem value={"disgust"}>disgust</MenuItem>
                <MenuItem value={"surprise"}>surprise</MenuItem>
                <MenuItem value={"anger"}>anger</MenuItem>
                <MenuItem value={"neutral"}>neutral</MenuItem>
              </Select>
            </FormControl>
            {/* <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Mood"
              type="text"
              value={editMood}
              // error={helpertext}
              // helperText={helpertext ? helpertext1 : null}
              onChange={(event) => setEditMood(event.target.value)}
              fullWidth
            /> */}
          </DialogContent>
          <DialogActions>
            <Button className={classes.root} onClick={updatedata}>
              Update
            </Button>

            <Button className={classes.root} onClick={handleEditClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default LiveAnalysis;
