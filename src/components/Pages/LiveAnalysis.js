import React, { useState,useEffect } from 'react'
import SideNav from '../Navigation/SideNav'
import { Card, Grid, Switch, FormControlLabel, Button } from '@material-ui/core'
import MaterialTable from 'material-table'
import Axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { green } from '@material-ui/core/colors'
import GridTimeFilter from '../Filters/GridTimeFilter'
import { addMonths } from '../../helpers'
import moment from 'moment'
import AccordianFilters from '../Filters/AccordianFilters'
import FilterWrapper from '../Filters/FilterWrapper'
import FilterHeader from '../Filters/FilterHeader'
import LaunchIcon from '@material-ui/icons/Launch';

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
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 'auto',
      width:'120px',
      margin:'10px',
      fontSize:'10px',
      padding: '10px',
      '&:hover': {
        background: 'rgb(67, 176, 42)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 'auto',
        width:'120px',
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

function LiveAnalysis() {

    const classes = useStyles();
    const [data, setData] = useState([]);
    const [liveReloading, setLiveReloading] = useState(false);
    const [reloadInterval, setReloadInterval] = useState(10000);
    const [to, setTo] = useState(new Date());
    const [from, setFrom] = useState(new Date());
    const [keyword, setKeyword] = useState('');
    const [source, setSource] = useState('twitter');
    const [sources, setSources] = useState([]);
    const [subSources, setSubSources] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [columns, setColumns] = useState([
        {title:'Name',field:'name'},
        {title:'Screen Name',field:'screenName'},
        {title:'Post',field:'tweet'},
        {title:'Followers Count',field:'followersCount',},
        {title:'Retweet Count',field:'retweetCount'},
        {title:'Mood',field:'mood'},
        {title:'Sentiment',field:'sentiment'},
    ])

    function fetchData(){
        let selectedSources = []
        Object.keys(sources).forEach(source =>{
            sources[source] && (selectedSources.push(source))
        })

        let selectedSubSources = []
        Object.keys(subSources).forEach(subSource =>{
            subSources[subSource] && (selectedSubSources.push(subSource))
        })

        let selectedlanguages = []
        Object.keys(languages).forEach(language =>{
            languages[language] && (selectedlanguages.push(language))
        })

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
                let obj = {}
                if(user._source.User){
                    obj.name =  user._source.User.Name
                    obj.screenName =  user._source.User.ScreenName
                    obj.followersCount =  user._source.User.FollowersCount
                }
                if(user._source.MediaEntities && user._source.MediaEntities.length){
                    obj.mediaUrl = user._source.MediaEntities.map((post,i)=>{
                      if(post.MediaURLHttps){
                        return (
                          <a target="_blank" style={{textDecoration:'none',color:'white'}} href={post.MediaURLHttps}>
                            <Button
                              endIcon={<LaunchIcon/>}
                              className={classes.root}
                        > Open Image {i+1} </Button> 
                          </a>
                        ) 
                      } else{
                        return (
                            <a target="_blank" style={{textDecoration:'none',color:'white'}} href={post.MediaURL}>
                              <Button
                          className={classes.root}
                          endIcon={<LaunchIcon/>}
                        >
                          Open Image {i+1}
                          </Button></a>) 
                      }
                    })
                    if(user._source.MediaEntities[0].ExpandedURL){
                      obj.postUrl = <a target="_blank" style={{textDecoration:'none',color:'white'}} href={user._source.MediaEntities[0].ExpandedURL}>
                      <Button
                        className={classes.root}
                        endIcon={<LaunchIcon/>}
                      > Click Here </Button></a> 
                    } else if(user._source.MediaEntities[0].DisplayURL){
                      obj.postUrl = <a target="_blank" style={{textDecoration:'none',color:'white'}} href={user._source.MediaEntities[0].DisplayURL}>
                      <Button
                        className={classes.root}
                        endIcon={<LaunchIcon/>}
                      > Click Here </Button></a> 
                    } else if(user._source.MediaEntities[0].Text){
                      obj.postUrl = <a target="_blank" style={{textDecoration:'none',color:'white'}} href={user._source.MediaEntities[0].Text}>
                      <Button
                        className={classes.root}
                        endIcon={<LaunchIcon/>}
                      > Click Here </Button></a> 
                    } else if(user._source.MediaEntities[0].URL){
                      obj.postUrl = <a target="_blank" style={{textDecoration:'none',color:'white'}} href={user._source.MediaEntities[0].URL}>
                      <Button
                        className={classes.root}
                        endIcon={<LaunchIcon/>}
                      > Click Here </Button></a> 
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
                    {title:'Screen Name',field:'screenName'},
                    {title:'Post',field:'tweet'},
                    {
                      title:'Media Urls',field:'mediaUrl'
                    },
                    {
                      title:'Post Url',field:'postUrl'
                    },
                    {title:'Followers Count',field:'followersCount'},
                    {title:'Retweet Count',field:'retweetCount'},
                    {title:'Mood',field:'mood'},
                    {title:'Sentiment',field:'sentiment'},
                ])
            } else if( source === 'facebook'){
                setColumns([
                    {title:'Date',field:'date'},
                    {title:'Post',field:'post'},
                    {title:'Replies',field:'retweetCount'},
                    {
                      title:'Media Urls',field:'mediaUrl'
                    },
                    {title:'Mood',field:'mood'},
                    {title:'Sentiment',field:'sentiment'},
                ])
            } else if( source === 'newspaper' ){
                setColumns([
                    {title:'Date',field:'date'},
                    {title:'Post',field:'post'},
                    {title:'Mood',field:'mood'},
                    {title:'Sentiment',field:'sentiment'},
                ])
            }
        })
        .catch(err => {console.log(err.response)})

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
            console.log(fetchedData.data.hits.hits);
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
    }, [reloadInterval,liveReloading,from,to,source])

    return (
        <SideNav>
            <Card style={{width:'100%'}}>
                <Grid container spacing={2} style={{padding:'20px'}}>
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
                <Grid item xs={2} align="left">
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
                   <Grid item xs={2}  >
                    {/* <TextField id="keyword" style={{transform:'translateY(10px)'}} label="Enter Keyword" variant="outlined" /> */}
                    </Grid>
                    <Grid item xs={4} align="left">
                        {/* <GridTimeFilter toFromDatesHandlers={[setTo,setFrom]} /> */}
                    </Grid>
                    <Grid item xs={2} align="left">
                    {/* <Button style={{transform:"translateY(10px)"}} onClick={() => fetchFromKeyword()} className={classes.button} >
                        Search
                    </Button> */}
                    </Grid>
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
                    <Grid xs={12} style={{backgroundColor:'black',width:'100%'}} >
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
            </Card>
        </SideNav>
    )
}

export default LiveAnalysis
