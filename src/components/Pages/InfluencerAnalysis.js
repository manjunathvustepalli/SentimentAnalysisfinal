import React, { useState, useEffect } from 'react'
import PropTypes from "prop-types";
import {Box, Grid, Typography, Card, CardContent, makeStyles, Tab, Tabs, Avatar, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import FilterWrapper from '../Filters/FilterWrapper'
import AccordianFilters from '../Filters/AccordianFilters'
import FilterHeader from '../Filters/FilterHeader'
import Table2 from '../Tables/Table2'
import Table3 from '../Tables/Table3'
import TreeMap from '../charts/TreeMap'
import { addMonths, capitalizeString } from '../../helpers'
import Axios from 'axios';
import { green } from '@material-ui/core/colors';
import EmailIcon from '@material-ui/icons/Email';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import AssignmentIcon from '@material-ui/icons/Assignment';
import colors from '../../helpers/colors';
import CustomLegend from '../CustomLegend';
import FacebookIcon from '@material-ui/icons/Facebook';
import { ArtTrack } from '@material-ui/icons';

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
            <Box>
            <div>{children}</div>
            </Box>
        )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      "aria-controls": `scrollable-auto-tabpanel-${index}`,
    };
}

function InfluencerAnalysis() {
    const [refresh, setRefresh] = useState(true)
    const [sources,setSources] = useState(['Twitter','Newspaper','Facebook'])
    const [source,setSource] = useState('Twitter')
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const [data, setData] = useState([])
    const [moodData, setMoodData] = useState([])
    const [sentimentData, setSentimentData] = useState([])
    const [size, setSize] = useState(10)
    const useStyles = makeStyles((theme) => ({
      root: {
        display: 'flex',
        '& > *': {
          margin: theme.spacing(1),
        },
      },
        main: {
    
            fontSize: 16,
            fontWeight: "bold",
            color: "#CB0038",
        },
        formControl: {
            margin: '20px',
            fullWidth: true,
            display: 'flex',
            wrap: 'nowrap'
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        dataDate:{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
            marginTop:50,
        },
        paper: {
            height: 140,
            width: 130,        
          },
        tabStyle: {
            borderStyle: 'solid', 
            borderWidth:'1px', 
            borderColor: 'rgb(67, 176, 42)', 
            color:'rgb(67, 176, 42)',
            marginTop: '15px',
            marginBottom: '10px'
        }
    }));
    const parentSentiment = [{
      id: 'negative',
      name: 'Negative',
      color: colors['negative'],
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
  }, {
      id: 'positive',
      name: 'Positive',
      color: colors['positive'],
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
      }
    }, {
      id: 'neutral',
      name: 'Neutral',
      color: colors['neutral'],
      dataLabels:{
      color:'#000',
      style:{
          textOutline:'none'
        }
      }
    }]
    const parentMood = [{
    id:'joy',
    name:'Joy',
    color:colors['joy'],                
    dataLabels:{
      color:'#000',
      style:{
          textOutline:'none'
      }
  }
  },{
    id:'sad',
    name:'sad',
    color:colors['sad'],
    dataLabels:{
      color:'#000',
      style:{
          textOutline:'none'
      }
  }
  },{
    id:'anger',
    name:'anger',
    color:colors['anger'],
    dataLabels:{
      color:'#000',
      style:{
          textOutline:'none'
      }
  }
  },{
    id:'anticipation',
    name:'anticipation',
    color:colors['anticipation'],
    dataLabels:{
      color:'#000',
      style:{
          textOutline:'none'
      }
  }
  },{
    id:'disgust',
    name:'disgust',
    color:colors['disgust'],
    dataLabels:{
      color:'#000',
      style:{
          textOutline:'none'
      }
  }
  },{
    id:'surprise',
    name:'surprise',
    color:colors['surprise'],
    dataLabels:{
      color:'#000',
      style:{
          textOutline:'none'
      }
  }
  },{
    id:'fear',
    name:'fear',
    color:colors['fear'],
    dataLabels:{
      color:'#000',
      style:{
          textOutline:'none'
      }
  }
  },{
    id:'trust',
    name:'trust',
    color:colors['trust'],
    dataLabels:{
      color:'#000',
      style:{
          textOutline:'none'
      }
  }
    }]

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if(source === 'Twitter'){
        Axios.post(process.env.REACT_APP_URL,
          {
            "query": {
              "bool": {
                "must": [
                  {"terms": {"Source.keyword": ["twitter"]}},
                  {"terms": {"Place.Country.keyword": ["Bangladesh"]}}
                ]
              }
            },
            "aggs": {
              "date-based-range": {
                "date_range": {
                  "field": "CreatedAt",
                  "format": "dd-MM-yyyy",
                  "ranges": [
                    { "from": from, "to":to }
                  ]
                },
                "aggs": {
                  "Users": {
                    "terms": {
                      "field": "User.ScreenName.keyword",
                      "size": 1000
                    },
                    "aggs": {
                      "Followers": {
                        "max": {
                          "field": "User.FollowersCount"
                        }
                      },
                      "Posts": {
                        "value_count": {
                          "field": "Id"
                        }
                      },
                      "influenceWeight": {
                        "bucket_script": {
                          "buckets_path": {
                            "postCount": "Posts",
                            "followers": "Followers"
                          },
                          "script": "params.followers * params.postCount"
                        }
                      },
                      "influence_sort" : {
                        "bucket_sort": {
                          "sort": [
                            {
                              "influenceWeight": {"order": "desc"}
                            }
                          ],
                          "size":size,
                        }
                      },
                      "Sentiment": {
                        "terms": {
                          "field": "predictedSentiment.keyword"
                        }
                      },
                      "Moods": {
                        "terms": {
                          "field": "predictedMood.keyword"
                        }
                      }
                    }
                  }
                }
              }
            }
          })
            .then(res => {
                setData(res.data.aggregations['date-based-range'].buckets[0].Users.buckets.map(doc => {
                    return {
                        influencer: <div className={classes.root} style={{display:'flex',alignItems:'center',justifyContent:'left'}} > <Avatar style={{backgroundColor:green[400] }} >{doc.key.split('')[0].toUpperCase()}</Avatar> &nbsp;&nbsp; {doc.key} </div>,
                        posts: <span> <EmailIcon style={{transform:'translateY(7px)'}} />&nbsp;&nbsp;&nbsp;{doc.Posts.value} </span>,
                        followers: <span> <SupervisorAccountIcon style={{transform:'translateY(7px)'}} />&nbsp;&nbsp;&nbsp;{doc.Followers.value} </span>,
                        mood: doc.Moods.buckets[0] ? (<span style={{color:doc.Moods.buckets[0].key !== 'sad' ? colors[doc.Moods.buckets[0].key] : ('#ddd')}} > {doc.Moods.buckets[0].key} </span> ) : (<span style={{color:'#aaa'}} > unknown </span> ),
                        sentiment: doc.Sentiment.buckets[0] ? (<span style={{color:colors[doc.Sentiment.buckets[0].key]}} > {doc.Sentiment.buckets[0].key} </span>) : (<span style={{color:'#aaa'}} > unknown </span>)  
                    }
                }))
                setMoodData(parentMood.concat(res.data.aggregations['date-based-range'].buckets[0].Users.buckets.map(doc => {
                  return {
                    name: doc.key,
                    posts:doc.Posts.value,
                    followers:doc.Followers.value,
                    parent: doc.Moods.buckets[0] ? (doc.Moods.buckets[0].key) : ("unknown"),
                    value:doc.influenceWeight.value,
                    dataLabels:{
                      color:'#000',
                      style:{
                          textOutline:'none'
                      }
                  }
                }     
              })))
              setSentimentData(parentSentiment.concat(res.data.aggregations['date-based-range'].buckets[0].Users.buckets.map(doc => {
                return {
                    name: doc.key,
                    posts:doc.Posts.value,
                    followers:doc.Followers.value,
                    parent: doc.Sentiment.buckets[0] ? (doc.Sentiment.buckets[0].key) : ("unknown"),
                    value:doc.influenceWeight.value,
                    dataLabels:{
                      color:'#000',
                      style:{
                          textOutline:'none'
                      }
                  }
                }
            })))
            })
            .catch(err => {
                console.log(err)
            })    
    } else if(source === 'Newspaper'|| source === 'Facebook') {
        Axios.post(process.env.REACT_APP_URL,{
          "query": {
            "terms": {
              "Source.keyword": [source.toLowerCase()]
            }
          },
          "aggs": {
            "date-based-range": {
              "date_range": {
                "field": "CreatedAt",
                "format": "dd-MM-yyyy",
                "ranges": [
                  { "from": from, "to":to }
                ]
              },
              "aggs": {
                "newspaperInfluencers": {
                  "terms": {
                    "field": "SubSource.keyword",
                  },
                  "aggs": {
                    "ArticleCount": {
                      "value_count": {
                        "field": "Id"
                      }
                    },
                    "influence_sort" : {
                      "bucket_sort": {
                        "sort": [
                          {
                            "ArticleCount": {"order": "desc"}
                          }
                        ],
                        "size":size,
                        "from":0
                      }
                    },
                    "Sentiment": {
                      "terms": {
                        "field": "predictedSentiment.keyword"
                      }
                    },
                    "Mood": {
                      "terms": {
                        "field": "predictedMood.keyword"
                      }
                    }
                  }
                }
              }
            }
          }
        })
          .then(res => {
              setData(res.data.aggregations['date-based-range'].buckets[0].newspaperInfluencers.buckets.map(doc =>{
                return {
                    newspaper:<div className={classes.root} style={{display:'flex',alignItems:'center',justifyContent:'left'}} > <Avatar style={{backgroundColor:green[400] }} > {source === 'Newspaper' ? (<ArtTrackIcon/>) : (<FacebookIcon/>)} </Avatar> &nbsp;&nbsp; {doc.key} </div>,
                    articles: <span> <EmailIcon style={{transform:'translateY(7px)'}} />&nbsp;&nbsp;&nbsp;{doc.ArticleCount.value} </span>,
                    mood:doc.Mood.buckets[0] ? (<span style={{color:doc.Mood.buckets[0].key !== 'sad' ? colors[doc.Mood.buckets[0].key] : ('#ddd')}} > {doc.Mood.buckets[0].key} </span> ) : (<span style={{color:'#aaa'}} > unknown </span> ),
                    sentiment:doc.Sentiment.buckets[0] ? (<span style={{color:colors[doc.Sentiment.buckets[0].key]}} > {doc.Sentiment.buckets[0].key} </span>) : (<span style={{color:'#aaa'}} > unknown </span>),
                }
            }))
            setMoodData(parentMood.concat(res.data.aggregations['date-based-range'].buckets[0].newspaperInfluencers.buckets.map(doc =>{
              return {
                  name:doc.key,
                  value:doc.ArticleCount.value,
                  parent:doc.Mood.buckets[0].key,
                  dataLabels:{
                    color:'#000',
                    style:{
                        textOutline:'none'
                    }
                }
              }
          })))
          setSentimentData(parentSentiment.concat(res.data.aggregations['date-based-range'].buckets[0].newspaperInfluencers.buckets.map(doc =>{
            return {
                name:doc.key,
                value:doc.ArticleCount.value,
                parent:doc.Sentiment.buckets[0].key,
                dataLabels:{
                  color:'#000',
                  style:{
                      textOutline:'none'
                  }
              }
            }
        })))
          })
          .catch(err => {
              console.log(err)
          })
    }
      },[from,to,source,size])
  
    return (
        <>
          <div style={{ backgroundColor: '#F7F7F7', padding:'20px', }}>
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px'}}>
                        Influencer Analysis
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card className={classes.main}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={7}>
                                        <CardContent>
                                            Top Influencers
                                        </CardContent>
                                    </Grid>
                                    <Grid xs={12} md={5}>
                                    <FormControl variant="outlined" className={classes.formControl}>
							                        <InputLabel id="top-influencers">Select Influencers Count</InputLabel>
							                        <Select
							                        	labelId="top-influencers"
							                        	id="top-influencers-select"
                                        label="Select Influencers Count"
                                        variant={'outlined'}
                                        fullWidth
                                        value={size}
                                        onChange={e => setSize(e.target.value)}
							                        >
							                        <MenuItem value={10}> Top 10 Influencers </MenuItem>
							                        <MenuItem value={25}> Top 25 Influencers </MenuItem>
							                        <MenuItem value={50}> Top 50 Influencers </MenuItem>
							                        </Select>
							                      </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            source === 'Twitter' ? (<Table2 data={data} />) : (<Table3 data={data} facebook={source === 'Facebook'} />)
                                        }
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card className={classes.main}>
                                <Grid item xs={12}>
                                    <Grid container spacing={2} style={{marginTop:'20px'}}>
                                        <Grid item xs={5}>
                                            <CardContent>Influncers Comparison</CardContent>
                                        </Grid>
                                        <Grid item xs={7} align={'right'}>
                                            <Tabs
                                                value={value}
                                                onChange={handleChange}
                                                indicatorColor="primary"
                                                textColor="primary"
                                                TabIndicatorProps={{style: {backgroundColor:'rgb(67, 176, 42)'}}}
                                                variant="scrollable"
                                                scrollButtons="auto"
                                                aria-label="scrollable auto tabs example"
                                            >
                                                <Tab label="Sentiment" style={{color:value===0 && ('white'),backgroundColor:value===0 && ('rgb(67, 176, 42)'),border:value !== 0 && ('2px solid rgb(67, 176, 42)')}} {...a11yProps(0)} />
                                                <Tab label="Mood" style={{color:value===1 && ('white'),backgroundColor:value===1 && ('rgb(67, 176, 42)'),border:value !== 1 && ('2px solid rgb(67, 176, 42)')}} {...a11yProps(1)} />
                                            </Tabs>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={11}>
                                    <TabPanel value={value} index={0}>
                                        <TreeMap title={`${source} Influence comparison Treemap based on Sentiment`} data={sentimentData} />
                                        <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                          {
                                            ['positive','negative','neutral'].map((sentiment) => <CustomLegend word={capitalizeString(sentiment)} color={colors[sentiment]} />)
                                          }
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                      <div id="treemap-wrapper" style={{width:'100%'}}>
                                        <TreeMap title={`${source} Influence comparison Treemap based on Mood`} data={moodData} />                                        
                                      </div>
                                        <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                          {
                                            ['joy','surprise','anticipation','sad','anger','disgust','fear','trust'].map((mood)=> <CustomLegend word={capitalizeString(mood)} color={colors[mood]} />)
                                          }
                                        </div>
                                    </TabPanel>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={4} sm={12} >
                    <Grid container spacing={1} style={{position:'sticky',top:'60px'}} >
                        <Grid item xs={12} >
                            <FilterHeader refresh={[refresh,setRefresh]} />
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                            <AccordianFilters 
                              toFromDatesHandlers={[setFrom,setTo,from,to]} 
                              radioSources={[source,setSource,sources]}
                                />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
      </>
      )
}

export default InfluencerAnalysis
