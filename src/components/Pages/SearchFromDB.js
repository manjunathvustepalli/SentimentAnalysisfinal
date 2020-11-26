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
  const [numberOfRecordsToFetch, setnumberofrecords] = useState(10);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
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

  const fetchData = () => {
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
    let data = "";
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
          queryStartDate: startDate,
          queryEndDate: endDate,
          numberOfRecordsToFetch: numberOfRecordsToFetch,
        });
      } else {
        data = JSON.stringify({
          querySources: selectedSources,
          // queryLanguages: ["english"],
          queryUserScreenNames: handles,
          queryHashtagEntities: keywords,
          queryStartDate: startDate,
          queryEndDate: endDate,
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
              // {
              //     title:'Mood',
              //     field:'mood',
              // },
              {
                title: "Language",
                field: "language",
              },
            ]);
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
    <Grid container>
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
      <Grid item xs={1} />

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={3}>
        <div style={{ width: "100%", padding: "0 0 0 90px" }}>
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
              Word Count
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={numberOfRecordsToFetch}
              onChange={(e) => setnumberofrecords(e.target.value)}
              label="Number of records to fetch "
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={40}>40</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={75}>75</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </MuiPickersUtilsProvider>

      <Grid item xs={12} style={{ marginTop: "20px", padding: "30px" }}>
        <MaterialTable
          title="Search Results"
          columns={columns}
          data={data}
          style={{ padding: "20px" }}
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
    </Grid>
  );
}

export default SearchFromDB;
