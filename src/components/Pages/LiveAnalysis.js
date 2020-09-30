import React, { useState,useEffect } from 'react'
import { Card, Grid, Switch, FormControlLabel, Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@material-ui/core'
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
    const [liveReloading, setLiveReloading] = useState(false);
    const [reloadInterval, setReloadInterval] = useState(10000);
    const [to] = useState(new Date());
    const [from] = useState(new Date());
    const [actualUrl, setactualUrl] = useState('');
    const [keyword] = useState('');
    const [languages, setLanguages] = useState(['bengali']);
    const [source, setSource] = useState('twitter');
    const [dataObject, setDataObject] = useState({})
    const [columns, setColumns] = useState([
        {title:'Name',field:'name'},
        {title:'Screen Name',field:'screenName',width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" }},
        {title:'Post',field:'tweet'},
        {title:'Followers Count',field:'followersCount',width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },},
        {title:'Retweet Count',field:'retweetCount',width: "1%",
        cellStyle: { whiteSpace: "nowrap" },
        headerStyle: { whiteSpace: "nowrap" },},
        {title:'Mood',field:'mood'},
        {title:'Sentiment',field:'sentiment'},
    ])
    const [open, setOpen] = React.useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [type, setType] = useState('image');
    const [content, setContent] = useState('');
  

    const getTwitterEmbed = (url) =>{
      Axios.get(`http://cors-anywhere.herokuapp.com/https://api.twitter.com/1/statuses/oembed.json?url=${url}`)
      .then(data => {
        console.log(data.data.html)
        setContent(data.data.html)
      })
      .catch(err => {
        console.log(err)
      })
    }

    const handleClose = () => {
      setOpen(false);
    };
    function fetchData(){
        Axios.post(process.env.REACT_APP_SEARCH_URL,{
            "query": {
              "bool": {
                "must": [
                  {
                    "terms": {
                      "Source.keyword": [
                        source
                      ]
                    }
                  },
                  {
                    "terms": {
                      "predictedLang.keyword": languages
                    }
                  }
                ]
              }
            },
            "size": 50,
            "sort": [
              {
                "CreatedAt": {
                  "order": "desc"
                }
              }
            ]
          })
        .then(fetchedData => {
            let final =  fetchedData.data.hits.hits.map(user => {
              console.log(user._source.MediaEntities)
                let obj = {}
                if(user._source.User){
                    obj.name =  user._source.User.Name
                    obj.screenName =  user._source.User.ScreenName
                    obj.followersCount =  user._source.User.FollowersCount
                }
                if(user._source.MediaEntities && user._source.MediaEntities.length){
                    obj.mediaUrl = user._source.MediaEntities.map((post,i)=>{
                      return (<IconButton
                        className={classes.root}
                        onClick = {() => {
                          setOpen(true)
                          setType('image')
                          if(post.MediaURLHttps){
                            setactualUrl(post.MediaURLHttps)
                            setImageUrl(post.MediaURLHttps);
                          } else{
                            setactualUrl(post.MediaURL)
                            setImageUrl(post.MediaURL);
                          }
                        }}
                      >
                        <LaunchIcon/>
                      </IconButton>) 
                    })
                     if(user._source.MediaEntities[0].ExpandedURL){
                      obj.postUrl =<IconButton 
                      onClick={() =>{
                        
                        setOpen(true)
                        setType('post')
                        let splittedUrl = user._source.MediaEntities[0].ExpandedURL.split('/photo')[0].split('/')
                        let id = splittedUrl[splittedUrl.length - 1]
                        setContent(id)
                        setactualUrl(user._source.MediaEntities[0].ExpandedURL)
                      }}
                      className={classes.root} > <LaunchIcon/> </IconButton>
                    }
                } else if(user._source.URLEntities && source !== 'twitter') {
                  if(user._source.URLEntities[0]){
                    obj.postUrl =<IconButton 
                    onClick={() =>{
                      setOpen(true)
                      setType('post')
                      setContent(user._source.URLEntities[0].URL)
                      setactualUrl(user._source.URLEntities[0].URL)
                    }}
                    className={classes.root} > <LaunchIcon/> </IconButton>
                  }                  
                }
                
                obj.date = dateFormatter(user._source.CreatedAt)
                obj.tweet =  user._source.Text
                obj.retweetCount =  user._source.RetweetCount
                obj.mood = user._source.predictedMood
                obj.sentiment = user._source.predictedSentiment
                return obj
            })
            setData(final)
            if(source === 'twitter'){
                setColumns([
                    {title:'Date',field:'date'},
                    {title:'Name',field:'name'},
                    {title:'Screen Name',field:'screenName',width: "1%",
                    cellStyle: { whiteSpace: "nowrap" },
                    headerStyle: { whiteSpace: "nowrap" }},
                    {title:'Post',field:'tweet'},
                    {title:'Followers Count',field:'followersCount',width: "1%",
                    cellStyle: { whiteSpace: "nowrap" },
                    headerStyle: { whiteSpace: "nowrap" },},
                    {title:'Retweet Count',field:'retweetCount',width: "1%",
                    cellStyle: { whiteSpace: "nowrap" },
                    headerStyle: { whiteSpace: "nowrap" },},
                    {title:'Mood',field:'mood'},
                    {title:'Sentiment',field:'sentiment'},
                    {
                      title:'Media',field:'mediaUrl',width: "1%",
                      headerStyle: { whiteSpace: "nowrap" }
                    },
                    {
                      title:'Post',field:'postUrl',width: "1%",
                      headerStyle: { whiteSpace: "nowrap" }
                    },
                ])
            } else if( source === 'facebook'){
                setColumns([
                    {title:'Date',field:'date'},
                    {title:'Post',field:'tweet'},
                    {title:'Replies',field:'retweetCount',width: "1%",
                    cellStyle: { whiteSpace: "nowrap" },
                    headerStyle: { whiteSpace: "nowrap" },},
                    {title:'Mood',field:'mood'},
                    {title:'Sentiment',field:'sentiment'},
                ])
            } else if( source === 'newspaper' ){
                setColumns([
                    {title:'Date',field:'date'},
                    {title:'Post',field:'tweet'},
                    {title:'Mood',field:'mood'},
                    {title:'Sentiment',field:'sentiment'},
                    {
                      title:'Media',field:'mediaUrl',width: "1%",
                      headerStyle: { whiteSpace: "nowrap" }
                    },
                    {
                      title:'Post',field:'postUrl',width: "1%",
                      headerStyle: { whiteSpace: "nowrap" }
                    },
                ])
            }
        })
        .catch(err => {console.log(err.response,err)})

    }

    function fetchFromKeyword(){
        Axios.post(process.env.REACT_APP_SEARCH_URL,{
            "query": {
              "bool": {
                "must": [
                  {
                    "terms": {
                      "Source.keyword": [
                        source
                      ]
                    }
                  }
                ], 
                "should": [
                  {
                    "terms": {
                      "User.ScreenName.keyword": [keyword]
                    }
                  }
                ]
              }
            },
            "size": 50,
            "sort": [
              {
                "CreatedAt": {
                  "order": "desc"
                }
              }
            ]
          })
          .then(fetchedData =>{
              let final =  fetchedData.data.hits.hits.map(user => {
                let obj = {}
                if(user._source.User){
                    obj.name =  user._source.User.Name
                    obj.screenName =  user._source.User.ScreenName
                    obj.followersCount =  user._source.User.FollowersCount
                }
                obj.tweet =  user._source.Text
                obj.retweetCount =  user._source.RetweetCount
                obj.mood = user._source.predictedMood
                obj.sentiment = user._source.predictedSentiment
                return obj
            })
            setData(final)
          })
          .catch(err => {
              console.log(err)
          })
    }    

    useEffect(() => {
        if(!keyword){
            fetchData()
        } else {
            fetchFromKeyword()
        }
        const interval = setInterval(() => {
            if(liveReloading && !keyword){
                fetchData()
            }
          }, reloadInterval);
          return () => clearInterval(interval);
    }, [reloadInterval,liveReloading,from,to,source,languages])

    useEffect(() => {
      Axios.post(process.env.REACT_APP_URL,{
        
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
        })
        .then(data => {
          let sourceBuckets = data.data.aggregations.Source.buckets
          let sourceKeys = getKeyArray(sourceBuckets)
          sourceKeys.forEach((source,i) => {
            sortedData[source] = getKeyArray(sourceBuckets[i].Lang.buckets)
          })
          setDataObject(sortedData)
        })
        .catch(err => {
          console.log(err)
        })
    }, [])

    return (
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
                            style={{
                              padding:'20px',
                              width:'100%',
                              overflow:'scroll'
                            }}
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
        <DialogTitle id="alert-dialog-slide-title"> {type === 'image' ? ('Image') : ('Post')} </DialogTitle>
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
    )
}

export default LiveAnalysis
