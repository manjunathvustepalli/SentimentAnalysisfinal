import React, { useState,useEffect } from 'react'
import { Grid, Switch, FormControlLabel, Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@material-ui/core'
import MaterialTable from 'material-table'
import Axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LaunchIcon from '@material-ui/icons/Launch';
import { getKeyArray } from '../../helpers'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Slide from '@material-ui/core/Slide';
import Image from 'material-ui-image'
import { Tweet } from 'react-twitter-widgets'
import { Auth } from './Auth'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const dateFormatter = (unix) => {
  var date = new Date(unix);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var month = date.getMonth()+1
  var year = date.getFullYear()
  var todayDate = date.getDate()
  return  todayDate+'/'+month+'/'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

const useStyles = makeStyles((theme) => ({
    root: {
      background: 'rgb(67, 176, 42)',
      color: 'white',
      height: 'auto',
      margin:'10px',
      fontSize:'10px',
      padding: '10px',
      '&:hover': {
        background: 'rgb(67, 176, 42)',
        color: 'white',
        height: 'auto',
        margin:'10px',
        fontSize:'10px',
        padding: '10px',
      }
    },
    formControl: {
        fullWidth:true
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    button:{
        margin: theme.spacing(1),
        color:'white',
        textAlign:'center',
        backgroundColor:'rgb(67, 176, 42)',
        '&:hover': {
            backgroundColor:'rgb(67, 176, 42)',
        }
    }
  }));
var sortedData = {}

function LiveAnalysis() {

    const classes = useStyles();
    const [data, setData] = useState([]);
    const [liveReloading, setLiveReloading] = useState(true);
    const [reloadInterval, setReloadInterval] = useState(10000);
    const [to] = useState(new Date());
    const [from] = useState(new Date());
    const [actualUrl, setactualUrl] = useState('');
    const [languages, setLanguages] = useState(['english']);
    const [source, setSource] = useState('twitter');
    const [dataObject, setDataObject] = useState({})
    const [columns, setColumns] = useState([
        {title:'Name',field:'name'},
        {title:'Screen Name',field:'screenName'},
        {title:'Post',field:'tweet'},
        {title:'Followers Count',field:'followersCount',},
        {title:'Retweet Count',field:'retweetCount'},
        {title:'Mood',field:'mood'},
        {title:'Sentiment',field:'sentiment'},
    ])
    const [open, setOpen] = React.useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [type, setType] = useState('image');
    const [content, setContent] = useState('');

    const handleClose = () => {
      setOpen(false);
    };
    function fetchData(){
        Axios.post(
          
            process.env.REACT_APP_SEARCH_URL,
          {
            query: {
              bool: {
                must: [
                  {
                    terms: {
                      "Source.keyword": [source],
                    },
                  },
                  {
                    terms: {
                      "predictedLang.keyword": languages,
                    },
                  },
                ],
              },
            },
            size: 50,
            sort: [
              {
                CreatedAt: {
                  order: "desc",
                },
              },
            ],
          },
          Auth
        )
          .then((fetchedData) => {
            console.log('fetch',fetchedData);
            let final = fetchedData.data.hits.hits.map((user) => {
              let obj = {};
              if (user._source.User) {
                obj.name = user._source.User.Name;
                obj.screenName = user._source.User.ScreenName;
                obj.followersCount = user._source.User.FollowersCount;
              }
              if (user._source.Place) {
                obj.location = user._source.Place.FullName;
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
              if (user._source.predictedSentiment) {
                if (user._source.predictedSentiment === "neutral")  {
                  obj.predictedSentiment = (
                    <Chip
                      label={user._source.predictedSentiment}
                      size="small"
                      style={{
                        margin: "5px",
                        backgroundColor: "#424242",
                        color: "white",
                      }}
                    />
                  );
                }
                if (user._source.predictedSentiment === "positive")  {
                  obj.predictedSentiment = (
                    <Chip
                      label={user._source.predictedSentiment}
                      size="small"
                      style={{
                        margin: "5px",
                        backgroundColor: "#00b0ff",
                        color: "white",
                      }}
                    />
                  );
                }
                if (user._source.predictedSentiment === "negative")  {
                  obj.predictedSentiment = (
                    <Chip
                      label={user._source.predictedSentiment}
                      size="small"
                      style={{
                        margin: "5px",
                        backgroundColor: "#ff1744",
                        color: "white",
                      }}
                    />
                  );
                }
                
              }
              if (
                user._source.MediaEntities &&
                user._source.MediaEntities.length
              ) {
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
                        } else {
                          setactualUrl(post.MediaURL);
                          setImageUrl(post.MediaURL);
                        }
                      }}
                    >
                      <LaunchIcon />
                    </IconButton>
                  );
                });
                if (user._source.MediaEntities[0].ExpandedURL) {
                  //  console.log("post",user._source.MediaEntities[0].ExpandedURL);
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
              obj.mediaSentiment = user._source.predictedSentiment;
              return obj;
            });
            setData(final);
            if (source === "twitter") {
              setColumns([
                { title: "Date", field: "date" },
                { title: "Name", field: "name" },
                { title: "Screen Name", field: "screenName" },
                { title: "Post", field: "tweet" },
                { title: "Mood", field: "mood" },
                { title: "Media Sentiment", field: "predictedSentiment" },
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
              ]);
            } else if (source === "facebook") {
              setColumns([
                { title: "Date", field: "date" },
                { title: "Post", field: "tweet" },
                { title: "Mood", field: "mood" },
                { title: "Sentiment", field: "sentiment" },
                {
                  title: "Replies",
                  field: "retweetCount",
                  width: "1%",
                  cellStyle: { whiteSpace: "nowrap" },
                  headerStyle: { whiteSpace: "nowrap" },
                },
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
              ]);
            } else if (source === "newspaper") {
              setColumns([
                { title: "Date", field: "date" },
                { title: "Post", field: "tweet" },
                { title: "Mood", field: "mood" },
                { title: "Sentiment", field: "sentiment" },
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
              ]);
            }
          })
          .catch((err) => {
            console.log(err.response, err);
          });

    }
    useEffect(() => {
            fetchData()
        const interval = setInterval(() => {
            if(liveReloading){
                fetchData()
            }
          }, reloadInterval);
          return () => clearInterval(interval);
    }, [reloadInterval,liveReloading,from,to,source,languages])

    useEffect(() => {
      Axios.post(
        process.env.REACT_APP_URL,
        {
          aggs: {
            Source: {
              terms: {
                field: "Source.keyword",
              },
              aggs: {
                Lang: {
                  terms: {
                    field: "predictedLang.keyword",
                  },
                },
              },
            },
          },
        },Auth
      )
        .then((data) => {
          let sourceBuckets = data.data.aggregations.Source.buckets;
          let sourceKeys = getKeyArray(sourceBuckets);
          sourceKeys.forEach((source, i) => {
            sortedData[source] = getKeyArray(sourceBuckets[i].Lang.buckets);
          });
          setDataObject(sortedData);
          console.log('MyData:',sourceBuckets);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [])

    return (
      <>
        <div style={{ backgroundColor: '#F7F7F7', padding:'20px', }}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <Grid container>
                            <Grid item xs={4} sm={3} md={2} lg={2}
                                    onClick={() => setSource('twitter')}
                                    style={{backgroundColor:source==='twitter'?'rgb(67,176,42)':'',cursor:'pointer',border:'2px solid rgb(67,176,42)',color:source==='twitter'?'white':'black', height:'50px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>
                                TWITTER
                            </Grid>
                            <Grid item xs={4} sm={3} md={2} lg={2} 
                                onClick={() => setSource('facebook')}
                                style={{backgroundColor:source==='facebook'?'rgb(67,176,42)':'',cursor:'pointer',border:'2px solid rgb(67,176,42)',color:source==='facebook'?'white':'black',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>
                                FACEBOOK
                            </Grid>
                            <Grid item xs={4} sm={3} md={2} lg={2} 
                                onClick={() => setSource('newspaper')}
                                style={{backgroundColor:source==='newspaper'?'rgb(67,176,42)':'',cursor:'pointer',border:'2px solid rgb(67,176,42)',color:source==='newspaper'?'white':'black',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>
                                NEWSPAPER
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid xs={2}>

                    </Grid>
                <Grid item xs={3} align="left">
                            <FormControlLabel
                                control={<Switch 
                                color="primary"
                                checked={liveReloading}
                                onChange={(e) => setLiveReloading(e.target.checked)}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />}
                                label="Live Reload"
                                labelPlacement="end"
                            />
                    </Grid>
                    <Grid item xs={1} align="left"/>
                    <Grid item xs={4} align="left">
                        {
                          Object.keys(dataObject).length  ? (
                            <div style={{width:'100%'}}>
                              <Autocomplete
                              multiple
                              fullWidth
                              id="tags-outlined"
                              value={languages}
                              onChange={(e,arr) => {
                                if(arr.includes('All')){
                                  setLanguages([...dataObject[source]])
                                } else {
                                  setLanguages(arr)
                                }
                              }}
                              options={[...dataObject[source],'All']}
                              getOptionLabel={(option) => option}
                              renderTags={(value, getTagProps) =>
                                  value.map((option, index) => (
                                    <Chip variant="outlined"  label={option} {...getTagProps({ index })} />
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
                          ) :('')
                        }
                    </Grid>
                    <Grid item align={'right'} xs={2} />
                    <Grid item xs={2}>
                        {
                            liveReloading && (
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">Reload Interval</InputLabel>
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
                            )
                        }
                    </Grid>
                    <Grid item xs={12}>
                      <MaterialTable 
                            title='Live Analysis'
                            columns={columns}
                            data={data}
                            options={{
                                grouping:!liveReloading,
                                paging:false,
                                maxBodyHeight:600,
                                headerStyle:{
                                    backgroundColor:'rgb(67, 176, 42)',
                                    color:'white',
                                    paddingTop:'10px',
                                    paddingBottom:'10px',
                                }
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
                style={{height:'700px'}}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{background: "rgb(67,176,42)", color: 'white'}} id="alert-dialog-slide-title"> {type === 'image' ? ('Image') : ('Post')} </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {type ==='image' ? (
              <Image src={imageUrl} style={{width:'100%'}} />
            ) : (
              source === 'twitter' ? (<Tweet style={{width:'100%',height:'70vh'}} tweetId={content} />) : (<iframe border={0} frameborder={0} style={{width:'500px',height:'70vh'}} sandbox="" title={'post'} src={content}></iframe>) 
            )}             
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <a href={actualUrl} style={{textDecoration:'none'}} target="_blank" rel="noopener noreferrer" >
          <Button  className={classes.root} >
            Visit
          </Button>
          </a>
          <Button  className={classes.root} onClick={handleClose} >
            Close
          </Button>
        </DialogActions>
      </Dialog>
        </div>
        </>
    )
}

export default LiveAnalysis
