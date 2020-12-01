import {
  Button,
  Chip,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
   
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import ChipInput from "material-ui-chip-input";
import MaterialTable from "material-table";
import { getKeyArray } from "../../helpers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Auth } from "./Auth";
import Cookies from "js-cookie";
import { addMonths } from "../../helpers/index";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import LaunchIcon from "@material-ui/icons/Launch";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import GridListTile from "@material-ui/core/GridListTile";
import Image from "material-ui-image";
import { Tweet } from "react-twitter-widgets";
import EditIcon from "@material-ui/icons/Edit";

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
  formControl: {
    margin: "20px",
    fullWidth: true,
    display: "flex",
    wrap: "nowrap",
  },
}));
function SearchFromDB() {
  const classes = useStyles();
  var makeDate = new Date();
  makeDate.setMonth(makeDate.getMonth() - 1);
  const [keywords, setKeywords] = useState();
  const [data, setData] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [handles, setHandles] = useState();
  const [startDate, setStartDate] = useState(makeDate);
  const [endDate, setEndDate] = useState(new Date());
  const [numberOfRecordsToFetch, setnumberofrecords] = useState(100);
  const [open, setOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("image");
  const [actualUrl, setactualUrl] = useState("");
  const [content, setContent] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState([]);
  const [editsentiment, setEditSentiment] = useState("");
  const [editMood, setEditMood] = useState("");
  const [editlanguage, setEditLanguage] = useState("");

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
  const updatedata = () => {
    handleEditClose(false);
    let token = Cookies.get("token");
    let data = "";
    if (selectedSources !== "newspaper") {
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

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
   const handleClose = () => {
     setOpen(false);
   };
  const [columns, setColumns] = useState([
    {
      title: "Date",
      field: "date",
    },
    {
      title: "Source",
      field: "source",
    },
    {
      title: "Sub Source",
      field: "subSource",
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

  const fetchData = async () => {
    // let query = {
    //     "query": {
    //       "bool": {
    //         "must": [
    //         ]
    //       }
    //     },
    //     "size": 50,
    //     "sort": [
    //       {
    //         "CreatedAt": {
    //           "order": "desc"
    //         }
    //       }
    //     ]
    //   }
    //   if(selectedSources.length){
    //       query.query.bool.must.push({
    //         "terms": {"Source.keyword":selectedSources}
    //       })
    //   }
    //   if(selectedSources.length === 1 && handles.length){
    //     if(selectedSources[0] === 'twitter' || selectedSources[0] === 'new-twitter'){
    //         query.query.bool.must.push({
    //             "terms": {"User.ScreenName.keyword":handles}
    //           })
    //     }else{
    //         query.query.bool.must.push({
    //             "terms": {"SubSource.keyword":handles}
    //         })
    //     }
    //   }
    //   if(keywords.length){
    //     query.query.bool.must.push({
    //         "terms": {"HashtagEntities.Text.keyword":keywords}
    //     })
    //   }
    //     Axios.post(

    //         process.env.REACT_APP_SEARCH_URL,
    //       query,Auth
    //     )
    // let data = JSON.stringify({ querySources: selectedSources });
    let startdate = await addMonths(startDate, 0);
    let enddate = await addMonths(endDate, 0);
    console.log(startdate, enddate);
    let data = "";
    let editDataAcess = Cookies.get("Update Data");
    if (selectedSources.length > 0) {
      if (
        selectedSources[0] === "twitter" ||
        selectedSources[0] === "new-twitter"
      ) {
        data = JSON.stringify({
          querySources: selectedSources,
          // queryLanguages: ["english"],
          queryUserScreenNames: handles,
          queryHashtagEntities: keywords,
          queryStartDate: startdate,
          queryEndDate: enddate,
          numberOfRecordsToFetch: numberOfRecordsToFetch,
        });
      } else {
        data = JSON.stringify({
          querySources: selectedSources,
          // queryLanguages: ["english"],
          queryUserScreenNames: handles,
          queryHashtagEntities: keywords,
          queryStartDate: startdate,
          queryEndDate: enddate,
          numberOfRecordsToFetch: numberOfRecordsToFetch,
        });
      }
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
        .then((fetchedData) => {
          setData(
            fetchedData.data.hits.hits.map((postObj) => {
              let obj = {  };
              if (postObj._source.PredictedImageSentiment) {
                obj.predictedSentiment = postObj._source.PredictedImageSentiment.map(
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
              else{
                  obj.predictedSentiment = <span />;
              }
              if (
                postObj._source.MediaEntities &&
                postObj._source.MediaEntities.length
              ) {
                obj.mediaUrl = postObj._source.MediaEntities.map((post, i) => {
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

                          // setsentiment(
                          //   user._source.PredictedImageSentiment[i]
                          // );
                        } else {
                          setactualUrl(post.MediaURL);
                          setImageUrl(post.MediaURL);

                          // setsentiment(
                          //   user._source.PredictedImageSentiment[i]
                          // );
                        }
                      }}
                    >
                      <LaunchIcon />
                    </IconButton>
                  );
                });
                if (postObj._source.MediaEntities[0].ExpandedURL) {
                  obj.postUrl = (
                    <IconButton
                      onClick={() => {
                        setOpen(true);
                        setType("post");
                        let splittedUrl = postObj._source.MediaEntities[0].ExpandedURL.split(
                          "/photo"
                        )[0].split("/");
                        let id = splittedUrl[splittedUrl.length - 1];
                        setContent(id);
                        setactualUrl(
                          postObj._source.MediaEntities[0].ExpandedURL
                        );
                      }}
                      className={classes.root}
                    >
                      {" "}
                      <LaunchIcon />{" "}
                    </IconButton>
                  );
                } else {
                  obj.postUrl = <span />;
                }
                 if (postObj._source.MediaEntities[0]) {
                   obj.postUrl = (
                     <IconButton
                       onClick={() => {
                         setOpen(true);
                         setType("post");
                         let splittedUrl = postObj._source.MediaEntities[0].ExpandedURL.split(
                           "/photo"
                         )[0].split("/");
                         let id = splittedUrl[splittedUrl.length - 1];
                         setContent(id);
                         setactualUrl(
                           postObj._source.MediaEntities[0].ExpandedURL
                         );
                       }}
                       className={classes.root}
                     >
                       {" "}
                       <LaunchIcon />{" "}
                     </IconButton>
                   );
                 } else {
                   obj.postUrl = <span />;
                 }
              }
              else{
                  obj.mediaUrl=( <span />);
              }
               
             
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
                  // mediaUrl: postObj._source.MediaEntities.map((image) => {
                  //   if (!image.MediaURL) {
                  //     return <span />;
                  //   }
                  //   return (
                  //     <IconButton
                  //       onClick={() => {
                  //         setImageUrl(image.MediaURL);
                  //         setOpen(true);
                  //       }}
                  //       style={{
                  //         backgroundColor: "rgb(67, 176, 42)",
                  //         color: "white",
                  //       }}
                  //     >
                  //       <LaunchIcon />
                  //     </IconButton>
                  //   );
                  // }),
                  mediaUrl: obj.mediaUrl,
                  predictedSentiment: obj.predictedSentiment,
                  id: postObj._id,
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
                  mediaUrl: obj.mediaUrl,
                  // mediaUrl: postObj._source.MediaEntities.map((image) => {
                  //   if (!image.MediaURL) {
                  //     return <span />;
                  //   }
                  //   return (
                  //     <IconButton
                  //       onClick={() => {
                  //         setImageUrl(image.MediaURL);
                  //         setOpen(true);
                  //       }}
                  //       style={{
                  //         backgroundColor: "rgb(67, 176, 42)",
                  //         color: "white",
                  //       }}
                  //     >
                  //       <LaunchIcon />
                  //     </IconButton>
                  //   );
                  // }),
                  predictedSentiment: obj.predictedSentiment,
                  id: postObj._id,
                };
              }
            })
          );
          if (sources.includes("twitter")) {
            setColumns([
              {
                title: "Date",
                field: "date",
              },
              {
                title: "Source",
                field: "source",
              },
              {
                title: "Sub Source",
                field: "subSource",
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
              { title: "Media Sentiment", field: "predictedSentiment" },
              {
                title: "Media",
                field: "mediaUrl",
              },
            ]);
          } else {
            setColumns([
              {
                title: "Date",
                field: "date",
              },
              {
                title: "Source",
                field: "source",
              },
              {
                title: "Sub Source",
                field: "subSource",
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
              { title: "Media Sentiment", field: "predictedSentiment" },
              {
                title: "Media",
                field: "mediaUrl",
                width: "1%",
                headerStyle: { whiteSpace: "nowrap" },
              },
             
            ]);
          }
          if(editDataAcess==="true"){
          
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    // Axios.post(
    //   process.env.REACT_APP_URL,
    //   {
    //     aggs: {
    //       Source: {
    //         terms: {
    //           field: "Source.keyword",
    //         },
    //       },
    //     },
    //   },Auth
    // )
    // let data = JSON.stringify({ querySources: ["newspaper", "twitter"] });
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
        setSources(getKeyArray(data.data.aggregations.Source.buckets));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleDateChange = (date) => {
    setStartDate(date);
  };
  return (
    <Grid container direction="row">
      <Grid item xs={2} />
      <Grid item xs={8} align={"center"} style={{ marginTop: "30px" }}>
        <Typography variant={"h5"} style={{ padding: "0 30px" }}>
          Search With Keyword from Database
        </Typography>
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={1} />
      <Grid item xs={3} style={{ marginTop: "20px" }}>
        <div style={{ width: "100%", padding: "0 10px" }}>
          <Autocomplete
            multiple
            fullWidth
            id="tags-outlined"
            value={selectedSources}
            onChange={(e, arr) => {
              if (arr.includes("All")) {
                setSelectedSources([...sources]);
              } else {
                setSelectedSources(arr);
              }
            }}
            options={[...sources, "All"]}
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
                label="Select Sources"
                placeholder="Sources"
              />
            )}
          />
        </div>
      </Grid>
      {selectedSources.length === 1 ? (
        <Grid item xs={2} style={{ marginTop: "20px", marginLeft: "10px" }}>
          <ChipInput
            fullWidth
            variant="outlined"
            label={`Type ${
              selectedSources[0] ? selectedSources[0] : ""
            } Handle to Search`}
            defaultValue={handles}
            onChange={(chips) => {
              setHandles(chips);
            }}
          />
        </Grid>
      ) : (
        <span />
      )}
      <Grid item xs={2} style={{ marginTop: "20px", marginLeft: "10px" }}>
        <ChipInput
          fullWidth
          variant="outlined"
          label="Type Keyword to Search"
          defaultValue={keywords}
          onChange={(chips) => {
            setKeywords(chips);
          }}
        />
      </Grid>
      <Grid item xs={2} style={{ marginTop: "20px" }}>
        <Button
          style={{
            backgroundColor: "rgb(67, 176, 42)",
            color: "white",
            height: "50px",
            marginLeft: "10px",
          }}
          onClick={() => fetchData()}
          fullWidth
        >
          Search
        </Button>
      </Grid>

      <Grid item xs={2} />

      <Grid container direction="row">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={3}>
            <div style={{ width: "100%", padding: "0 0 0 100px" }}>
              <KeyboardDatePicker
                margin="normal"
                inputVariant="outlined"
                id="date-picker-dialog"
                label="Start Date"
                format="dd-MM-yyyy"
                value={startDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
          </Grid>

          <Grid item xs={1} />
          <Grid item xs={2}>
            <KeyboardDatePicker
              // className={classes.formControl}
              margin="normal"
              id="date-picker-dialog"
              inputVariant="outlined"
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              format="dd-MM-yyyy"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Record Count
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={numberOfRecordsToFetch}
                onChange={(e) => setnumberofrecords(e.target.value)}
                label="Number of records to fetch "
              >
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={200}>200</MenuItem>
                <MenuItem value={500}>500</MenuItem>
                <MenuItem value={1000}>1000</MenuItem>
                <MenuItem value={2000}>2000</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>

      <Grid item xs={12} style={{ marginTop: "20px", padding: "30px" }}>
        <MaterialTable
          title="Search Results"
          columns={columns}
          data={data}
          style={{ padding: "15px" }}
          options={{
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
      </Grid>
      <Dialog
        fullWidth
        style={{ height: "700px" }}
        open={open}
        // TransitionComponent={Transition}
        // keepMounted
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
                          {/* <br></br>CONFIDENCE: {sentiment.confidence} */}
                        </span>
                      </>
                    }
                    // actionIcon={
                    //   <IconButton
                    //     aria-label={`info about `}
                    //     className={classes.icon}
                    //   >
                    //     {sentiment.sentiment === "positive" ? (
                    //       <Chip
                    //         size="small"
                    //         label="Positive"
                    //         style={{ backgroundColor: "#008000" }}
                    //       />
                    //     ) : sentiment.sentiment === "negative" ? (
                    //       <Chip
                    //         size="small"
                    //         label="Negative"
                    //         style={{ backgroundColor: "#FF0000" }}
                    //       />
                    //     ) : (
                    //       <Chip
                    //         size="small"
                    //         label={sentiment.sentiment}
                    //         color="#FF0000"
                    //       />
                    //     )}
                    //   </IconButton>
                    // }
                  />
                </GridListTile>
              </>
            ) : selectedSources === "twitter" ? (
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
        // TransitionComponent={Transition}
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
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Language"
            type="text"
            value={editlanguage}
            onChange={(event) => setEditLanguage(event)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Sentiment"
            type="text"
            value={editsentiment}
            onChange={(event) => setEditSentiment(event.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Mood"
            type="text"
            value={editMood}
            // error={helpertext}
            // helperText={helpertext ? helpertext1 : null}
            onChange={(event) => setEditMood(event)}
            fullWidth
          />
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
    </Grid>
  );
}

export default SearchFromDB;
