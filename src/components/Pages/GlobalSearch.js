import {
  Button,
  capitalize,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Slide,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import ChipInput from "material-ui-chip-input";
import Axios from "axios";
import MaterialTable from "material-table";
import Loader from "../LoaderWithBackDrop";
import LaunchIcon from "@material-ui/icons/Launch";
import Image from "material-ui-image";
import Cookies from "js-cookie";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import EditIcon from "@material-ui/icons/Edit";
import { Instagram } from "@material-ui/icons";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function GlobalSearch() {
  const [open1, setOpen1] = React.useState(false);

  const handleClick = () => {
    setOpen1(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen1(false);
  };

  const [source, setSource] = useState("twitter");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [handles, setHandles] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [open, setopen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState([]);
  const [editsentiment, setEditSentiment] = useState("");
  const [editMood, setEditMood] = useState("");
  const [editlanguage, setEditLanguage] = useState("");
  const [liveReloading, setLiveReloading] = useState(false);
  const [reloadInterval, setReloadInterval] = useState(10000);
  const [editDataAcess] = useState(Cookies.get("Update Data"));
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleEditData = async (rowData) => {
    setEditData(rowData);
    setEditSentiment(rowData.sentiment);
    setEditMood(rowData.mood);
    setEditLanguage(rowData.language);

    setEditOpen(true);
  };
  const twittersearch = () => {
    console.log("/////////////////////////////////////");
    let data = JSON.stringify({
      querySources: [source],
      queryUserScreenNames: handles,
      queryHashtagEntities: keywords,
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

    Axios(config)
      .then((data) => {
        console.log(data);
        setData(
          data.data.hits.hits.map((postObj) => {
            if (!postObj._source.User) {
              return {
                date: dateFormatter(postObj._source.CreatedAt),
                post: postObj._source.Text,
                favouriteCount: postObj._source.FavoriteCount,
                sentiment: postObj._source.predictedSentiment,
                mood: postObj._source.predictedMood,
                language: postObj._source.predictedLang,
                id: postObj._id,
              };
            } else {
              return {
                date: dateFormatter(postObj._source.CreatedAt),
                post: postObj._source.Text,
                favouriteCount: postObj._source.FavoriteCount,
                sentiment: postObj._source.predictedSentiment,
                mood: postObj._source.predictedMood,
                language: postObj._source.predictedLang,
                followersCount: postObj._source.User.FollowersCount,
                location: postObj._source.User.Location,
                name: postObj._source.User.Name,
                screenName: postObj._source.User.ScreenName,
                id: postObj._id,
              };
            }
          })
        );
        setColumns([
          {
            title: "Date",
            field: "date",
          },
          {
            title: "Name",
            field: "name",
          },
          {
            title: "Screen Name",
            field: "screenName",
          },
          {
            title: "Post",
            field: "post",
          },
          {
            title: "Followers Count",
            field: "followersCount",
          },
          {
            title: "Location",
            field: "location",
          },
          {
            title: "Sentiment",
            field: "sentiment",
          },
          {
            title: "Mood",
            field: "mood",
          },
          {
            title: "Language",
            field: "language",
          },
        ]);
        if (editDataAcess === "true") {
          let editicon = {
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
          };
          setColumns((oldArray) => [...oldArray, editicon]);
        }
        setopen(false);
      })
      .catch((err) => {
        console.log(err);
        setopen(false);
      });
  };
  const facebookseach = () => {
    let data = JSON.stringify({
      querySources: [source],
      queryUserScreenNames: handles,
      //  queryHashtagEntities: keywords,
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

    Axios(config)
      .then((data) => {
        setData(
          data.data.hits.hits.map((postObj, i) => {
            return {
              date: dateFormatter(postObj._source.CreatedAt),
              post: postObj._source.Text,
              favouriteCount: postObj._source.FavoriteCount,
              sentiment: postObj._source.predictedSentiment,
              mood: postObj._source.predictedMood,
              language: postObj._source.predictedLang,
              screenName: postObj._source.SubSource,
              id: postObj._id,
            };
          })
        );
        setColumns([
          {
            title: "Date",
            field: "date",
          },
          {
            title: "Screen Name",
            field: "screenName",
          },
          {
            title: "Post",
            field: "post",
          },
          {
            title: "Sentiment",
            field: "sentiment",
          },
          {
            title: "Mood",
            field: "mood",
          },
          {
            title: "Language",
            field: "language",
          },
        ]);
        if (editDataAcess === "true") {
          let editicon = {
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
          };
          setColumns((oldArray) => [...oldArray, editicon]);
        }
        setopen(false);
      })
      .catch((err) => {
        console.log(err);
        setopen(false);
      });
  };
  const Instagramsearch = () => {
    let data = JSON.stringify({
      querySources: [source],
      queryUserScreenNames: handles,
      //  queryHashtagEntities: keywords,
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

    Axios(config).then((data) => {
      console.log(data.data.hits.hits);
      setData(
        data.data.hits.hits.map((postObj, i) => {
          if (
            postObj._source.MediaEntities &&
            postObj._source.MediaEntities.length
          ) {
            return {
              date: dateFormatter(postObj._source.CreatedAt),
              post: postObj._source.Text,
              favouriteCount: postObj._source.FavoriteCount,
              sentiment: postObj._source.predictedSentiment,
              mood: postObj._source.predictedMood,
              language: postObj._source.predictedLang,
              screenName: postObj._source.SubSource,
              id: postObj._id,
              image: postObj._source.MediaEntities.map((image) => {
                if (!image.MediaURL) {
                  return <span />;
                }
                return (
                  <IconButton
                    onClick={() => {
                      setImageUrl(image.MediaURL);
                      setDialogOpen(true);
                    }}
                    style={{
                      backgroundColor: "rgb(67, 176, 42)",
                      color: "white",
                    }}
                  >
                    <LaunchIcon />
                  </IconButton>
                );
              }),
            };
          } else {
            return {
              date: dateFormatter(postObj._source.CreatedAt),
              post: postObj._source.Text,
              favouriteCount: postObj._source.FavoriteCount,
              sentiment: postObj._source.predictedSentiment,
              mood: postObj._source.predictedMood,
              language: postObj._source.predictedLang,
              screenName: postObj._source.SubSource,
              id: postObj._id,
            };
          }
        })
      );
      setColumns([
        {
          title: "Date",
          field: "date",
        },
        {
          title: "Screen Name",
          field: "screenName",
        },
        {
          title: "Post",
          field: "post",
        },
        {
          title: "Sentiment",
          field: "sentiment",
        },
        {
          title: "Mood",
          field: "mood",
        },
        {
          title: "Language",
          field: "language",
        },
        {
          title: "Media Urls",
          field: "image",
        },
      ]);
      if (editDataAcess === "true") {
        let editicon = {
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
        };
        setColumns((oldArray) => [...oldArray, editicon]);
      }
      setopen(false);
    });
  };
  const telegramsearch = () => {
    let data = JSON.stringify({
      querySources: [source],
      queryUserScreenNames: handles,
      //  queryHashtagEntities: keywords,
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

    Axios(config).then((data) => {
      console.log(data);
      setData(
        data.data.hits.hits.map((postObj, i) => {
          return {
            date: dateFormatter(postObj._source.CreatedAt),
            post: postObj._source.Text,
            favouriteCount: postObj._source.FavoriteCount,
            sentiment: postObj._source.predictedSentiment,
            mood: postObj._source.predictedMood,
            language: postObj._source.predictedLang,
            screenName: postObj._source.SubSource,
            id: postObj._id,
          };
        })
      );
      setColumns([
        {
          title: "Date",
          field: "date",
        },
        {
          title: "Screen Name",
          field: "screenName",
        },
        {
          title: "Post",
          field: "post",
        },
        {
          title: "Sentiment",
          field: "sentiment",
        },
        {
          title: "Mood",
          field: "mood",
        },
        {
          title: "Language",
          field: "language",
        },
      ]);
      if (editDataAcess === "true") {
        let editicon = {
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
        };
        setColumns((oldArray) => [...oldArray, editicon]);
      }
      setopen(false);
    });
  };
  const bloggersearch = () => {
    let data = JSON.stringify({
      querySources: [source],
      queryUserScreenNames: handles,
      //  queryHashtagEntities: keywords,
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

    Axios(config).then((data) => {
      console.log(data);
      setData(
        data.data.hits.hits.map((postObj, i) => {
          return {
            date: dateFormatter(postObj._source.CreatedAt),
            post: postObj._source.Text,
            favouriteCount: postObj._source.FavoriteCount,
            sentiment: postObj._source.predictedSentiment,
            mood: postObj._source.predictedMood,
            language: postObj._source.predictedLang,
            screenName: postObj._source.SubSource,
            id: postObj._id,
          };
        })
      );
      setColumns([
        {
          title: "Date",
          field: "date",
        },
        {
          title: "Screen Name",
          field: "screenName",
        },
        {
          title: "Post",
          field: "post",
        },
        {
          title: "Sentiment",
          field: "sentiment",
        },
        {
          title: "Mood",
          field: "mood",
        },
        {
          title: "Language",
          field: "language",
        },
      ]);
      if (editDataAcess === "true") {
        let editicon = {
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
        };
        setColumns((oldArray) => [...oldArray, editicon]);
      }
      setopen(false);
    });
  };
  const googlenewssearch = () => {
    let data = JSON.stringify({
      querySources: [source],
      queryUserScreenNames: handles,
      //  queryHashtagEntities: keywords,
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

    Axios(config).then((data) => {
      console.log(data);
      setData(
        data.data.hits.hits.map((postObj, i) => {
          return {
            date: dateFormatter(postObj._source.CreatedAt),
            post: postObj._source.Text,
            favouriteCount: postObj._source.FavoriteCount,
            sentiment: postObj._source.predictedSentiment,
            mood: postObj._source.predictedMood,
            language: postObj._source.predictedLang,
            screenName: postObj._source.SubSource,
            id: postObj._id,
          };
        })
      );
      setColumns([
        {
          title: "Date",
          field: "date",
        },
        {
          title: "Screen Name",
          field: "screenName",
        },
        {
          title: "Post",
          field: "post",
        },
        {
          title: "Sentiment",
          field: "sentiment",
        },
        {
          title: "Mood",
          field: "mood",
        },
        {
          title: "Language",
          field: "language",
        },
      ]);
      if (editDataAcess === "true") {
        let editicon = {
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
        };
        setColumns((oldArray) => [...oldArray, editicon]);
      }
      setopen(false);
    });
  };
  const updatedata = () => {
    handleEditClose(false);
    let token = Cookies.get("token");
    let data = "";
    if (source !== "newspaper") {
      data = JSON.stringify({
        predictedRecordForUpdate: {
          id: editData.id,
          text: editData.post,
          oldPredictedLanguage: editData.language,
          newPredictedLanguage: editlanguage,
          oldPredictedSentiment: editData.sentiment,
          newPredictedSentiment: editsentiment,
          oldPredictedMood: editData.mood,
          newPredictedMood: editMood,
        },
      });
    } else {
      data = JSON.stringify({
        predictedRecordForUpdate: {
          id: editData.id,
          textBody: editData.post,
          oldPredictedLanguage: editData.language,
          newPredictedLanguage: editlanguage,
          oldPredictedSentiment: editData.sentiment,
          newPredictedSentiment: editsentiment,
          oldPredictedMood: editData.mood,
          newPredictedMood: editMood,
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
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitData = () => {
    let token = Cookies.get("token");
    setopen(true);
    let keywordsString = keywords.join(",");
    // let handles = handles.join(',')
    let temp = [];
    console.log("///////////", source);
    if (source === "twitter") {
      // Axios.post(
      //   `${process.env.REACT_APP_URL}/fetchdatafromtwitter?keywords=${keywordsString}&handles=${handles}`
      // )
      let data = JSON.stringify({
        keywords: keywords,
        handles: handles,
        doNotSchedule: true,
      });

      let config = {
        method: "post",
        url: process.env.REACT_APP_URL + "fetchdatafromtwitter",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        data: data,
      };

      Axios(config)
        .then((res) => {
          console.log(res);
          if (res.data.status === "Success") {
            // let query = {
            //   query: {
            //     bool: {
            //       must: [{ terms: { "Source.keyword": [source] } }],
            //     },
            //   },
            //   size: 50,
            //   sort: [
            //     {
            //       CreatedAt: {
            //         order: "desc",
            //       },
            //     },
            //   ],
            // };
            // if (handles.length) {
            //   query.query.bool.must.push({
            //     terms: {
            //       "User.ScreenName.keyword": handles,
            //     },
            //   });
            // }
            // if (keywords.length) {
            //   query.query.bool.must.push({
            //     terms: {
            //       "HashtagEntities.Text.keyword": keywords,
            //     },
            //   });
            // }
            // Axios.post(process.env.REACT_APP_SEARCH_URL, query)
            console.log("//////////////////////////////");
            twittersearch();
          } else {
            handleClick();
            setopen(false);
          }
        })
        .catch((err) => {
          console.log(err, err.response);
          setopen(false);
        });
    } else if (source === "facebook") {
      // Axios.post(`${process.env.REACT_APP_URL}/fetchdatafromfb?fbpage=${handles}`)
      let data = JSON.stringify({
        fbpages: handles,
        doNotSchedule: true,
      });

      let config = {
        method: "post",
        url: process.env.REACT_APP_URL + "startcrawlingfbpage",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        data: data,
      };

      Axios(config)
        .then((res) => {
          if (res.data.status === "Success") {
            // let query = {
            //   query: {
            //     bool: {
            //       must: [{ terms: { "Source.keyword": [source] } }],
            //     },
            //   },
            //   size: 50,
            //   sort: [
            //     {
            //       CreatedAt: {
            //         order: "desc",
            //       },
            //     },
            //   ],
            // };
            // if (handles.length) {
            //   query.query.bool.must.push({
            //     terms: {
            //       "SubSource.keyword": handles,
            //     },
            //   });
            // }
            // if (keywords.length) {
            //   query.query.bool.must.push({
            //     terms: {
            //       "HashtagEntities.Text.keyword": keywords,
            //     },
            //   });
            // }
            setTimeout(() => {
              //   Axios.post(process.env.REACT_APP_SEARCH_URL, query)
              facebookseach();
            }, 10000);
          } else {
            handleClick();
            setopen(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setopen(false);
        });
    } else if (source === "instagram") {
      // Axios.post(`${process.env.REACT_APP_URL}/fetchdatafrominstagram?instapage=${handles}&keywords=${keywordsString}`)
      let data = JSON.stringify({
        instapages: handles,
        doNotSchedule: true,
      });

      let config = {
        method: "post",
        url: process.env.REACT_APP_URL + "startcrawlinginstagrampage",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        data: data,
      };

      Axios(config).then((res) => {
        console.log(res);
        if (res.data.status === "Success") {
          // let query = {
          //   query: {
          //     bool: {
          //       must: [{ terms: { "Source.keyword": [source] } }],
          //     },
          //   },
          //   size: 50,
          //   sort: [
          //     {
          //       CreatedAt: {
          //         order: "desc",
          //       },
          //     },
          //   ],
          // };
          // if (handles.length) {
          //   query.query.bool.must.push({
          //     terms: {
          //       "SubSource.keyword": handles,
          //     },
          //   });
          // }
          // if (keywords.length) {
          //   query.query.bool.must.push({
          //     terms: {
          //       "HashtagEntities.Text.keyword": keywords,
          //     },
          //   });
          // }

          // Axios.post(process.env.REACT_APP_SEARCH_URL, query)
          Instagramsearch();
        } else {
          handleClick();
          setopen(false);
        }
      });
    } else if (source === "telegram") {
      // Axios.post(`${process.env.REACT_APP_URL}/fetchdatafromtelegramchannel?telegramchannel=${handles}&keywords=${keywordsString}`)
      let data = JSON.stringify({
        telegramchannels: handles,
        doNotSchedule: true,
      });

      let config = {
        method: "post",
        url: process.env.REACT_APP_URL + "startcrawlingtelegramchannel",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        data: data,
      };

      Axios(config).then((res) => {
        console.log(res);
        if (res.data.status === "Success") {
          // let query = {
          //   query: {
          //     bool: {
          //       must: [{ terms: { "Source.keyword": [source] } }],
          //     },
          //   },
          //   size: 50,
          //   sort: [
          //     {
          //       CreatedAt: {
          //         order: "desc",
          //       },
          //     },
          //   ],
          // };
          // if (handles.length) {
          //   query.query.bool.must.push({
          //     terms: {
          //       "SubSource.keyword": handles,
          //     },
          //   });
          // }
          // if (keywords.length) {
          //   query.query.bool.must.push({
          //     terms: {
          //       "HashtagEntities.Text.keyword": keywords,
          //     },
          //   });
          // }

          // Axios.post(process.env.REACT_APP_SEARCH_URL, query)
          telegramsearch();
        } else {
          handleClick();
          setopen(false);
        }
      });
    } else if (source === "blogger") {
      // Axios.post(`${process.env.REACT_APP_URL}/fetchdatafromblogger?bloggerpage=${handles}&keywords=${keywordsString}`)
      let data = JSON.stringify({
        bloggerpages: handles,
        doNotSchedule: true,
      });

      let config = {
        method: "post",
        url: process.env.REACT_APP_URL + "startcrawlingbloggerpage",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        data: data,
      };

      Axios(config).then((res) => {
        console.log(res);
        if (res.data.status === "Success") {
          // let query = {
          //   query: {
          //     bool: {
          //       must: [{ terms: { "Source.keyword": [source] } }],
          //     },
          //   },
          //   size: 50,
          //   sort: [
          //     {
          //       CreatedAt: {
          //         order: "desc",
          //       },
          //     },
          //   ],
          // };
          // if (handles.length) {
          //   query.query.bool.must.push({
          //     terms: {
          //       "SubSource.keyword": handles,
          //     },
          //   });
          // }
          // if (keywords.length) {
          //   query.query.bool.must.push({
          //     terms: {
          //       "HashtagEntities.Text.keyword": keywords,
          //     },
          //   });
          // }

          // Axios.post(process.env.REACT_APP_SEARCH_URL, query)
          bloggersearch();
        } else {
          handleClick();
          setopen(false);
        }
      });
    } else if (source === "google news") {
      // Axios.post(`${process.env.REACT_APP_URL}/fetchdatafromgooglenews?googlenewspage=${handles}&keywords=${keywordsString}`)
      let data = JSON.stringify({
        googlenewspages: handles,
        doNotSchedule: true,
      });

      let config = {
        method: "post",
        url: process.env.REACT_APP_URL + "startcrawlinggooglenewspage",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        data: data,
      };

      Axios(config).then((res) => {
        if (res.data.status === "Success") {
          // let query = {
          //   query: {
          //     bool: {
          //       must: [{ terms: { "Source.keyword": ["googlenews"] } }],
          //     },
          //   },
          //   size: 50,
          //   sort: [
          //     {
          //       CreatedAt: {
          //         order: "desc",
          //       },
          //     },
          //   ],
          // };
          // if (handles.length) {
          //   query.query.bool.must.push({
          //     terms: {
          //       "SubSource.keyword": handles,
          //     },
          //   });
          // }
          // if (keywords.length) {
          //   query.query.bool.must.push({
          //     terms: {
          //       "HashtagEntities.Text.keyword": keywords,
          //     },
          //   });
          // }

          // Axios.post(process.env.REACT_APP_SEARCH_URL, query)
          googlenewssearch();
        } else {
          handleClick();
          setopen(false);
        }
      });
    }
  };
  useEffect(() => {
    // submitData("queryFirstTime");
    const interval = setInterval(() => {
      if (liveReloading) {
        if (source === "twitter") {
          twittersearch();
        } else if (source === "facebook") {
          facebookseach();
        } else if (source === "instagram") {
          Instagramsearch();
        } else if (source === "telegram") {
          telegramsearch();
        } else if (source === "blogger") {
          bloggersearch();
        } else if (source === "google news") {
          googlenewssearch();
        }
      }
    }, reloadInterval);
    return () => clearInterval(interval);
  }, [reloadInterval, liveReloading, keywords, handles, source]);

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
  }));

  const classes = useStyles();

  return (
    <>
      <Grid
        container
        spacing={1}
        style={{ padding: "30px", position: "relative" }}
      >
        <Loader open={open} style={{ position: "absolute" }} />
        <Grid item sm={12} md={3}>
          <FormControl style={{ width: "100%" }} variant="outlined">
            <InputLabel id="source-select-label">Select Source</InputLabel>
            <Select
              labelId="source-select-label"
              id="source-select"
              value={source}
              onChange={(e) => {
                setData([]);
                setSource(e.target.value);
                setKeywords([]);
                setHandles([]);
              }}
              label={"Select Source"}
            >
              {[
                "facebook",
                "twitter",
                "instagram",
                // "telegram",
                // "blogger",
                // "google news",
              ].map((source, i) => (
                <MenuItem value={source} key={i}>
                  {capitalize(source)}{" "}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={12} md={3}>
          <ChipInput
            fullWidth
            variant="outlined"
            blurBehavior="add"
            label={`Type ${source} Handle`}
            value={handles}
            onAdd={(chip) => {
              setHandles((prev) => [...prev, chip]);
            }}
            onDelete={(chip, i) => {
              setHandles((prev) => {
                let data = [...prev];
                data.splice(i, 1);
                return data;
              });
            }}
          />
        </Grid>
        {source === "twitter" ? (
          <Grid item sm={12} md={3}>
            <ChipInput
              fullWidth
              blurBehavior="add"
              variant="outlined"
              label="Type Keywords"
              value={keywords}
              onAdd={(chip) => {
                setKeywords((prev) => {
                  let otherChip = "";
                  if (chip.startsWith("#")) {
                    otherChip = chip.slice(1, chip.length);
                  } else {
                    otherChip = "#" + chip;
                  }
                  return [...prev, otherChip, chip];
                });
              }}
              onDelete={(chip, i) => {
                setKeywords((prev) => {
                  let data = [...prev];
                  data.splice(i, 1);
                  return data;
                });
              }}
            />
          </Grid>
        ) : null}
        <Grid item xs={12} md={2}>
          <Button
            style={{
              backgroundColor: "rgb(67, 176, 42)",
              color: "white",
              height: "50px",
            }}
            onClick={() => submitData("queryFirstTime")}
            fullWidth
          >
            Search
          </Button>
        </Grid>
        <Grid
          container
          spacing={6}
          style={{ padding: "30px", position: "relative" }}
        >
          <Grid item align="left">
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
          <Grid item>
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
        </Grid>
        <Grid item xs={12}>
          <div style={{ width: "100%" }}>
            <MaterialTable
              style={{
                padding: "20px",
              }}
              title="Search Results"
              columns={columns}
              data={data}
              options={{
                paging: false,
                tableLayout: "fixed",
                maxBodyHeight: 500,
                headerStyle: {
                  backgroundColor: "rgb(67, 176, 42)",
                  color: "white",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                },
              }}
            />
          </div>
        </Grid>
      </Grid>
      <Snackbar open={open1} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Something went wrong please try again.
        </Alert>
      </Snackbar>
      <Dialog
        fullWidth
        style={{ height: "700px" }}
        open={dialogOpen}
        // TransitionComponent={Transition}
        // keepMounted
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title"> Image </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Image src={imageUrl} style={{ width: "100%" }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className={classes.root} onClick={() => setDialogOpen(false)}>
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
            <InputLabel id="demo-simple-select-required-label">Mood</InputLabel>
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
    </>
  );
}

export default GlobalSearch;
