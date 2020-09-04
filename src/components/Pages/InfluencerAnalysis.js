import React, { useState, useEffect } from 'react'
import SideNav from '../Navigation/SideNav'
import PropTypes from "prop-types";
import {Box, Grid, Typography, Card, CardContent, FormControl, InputLabel, MenuItem, Select,makeStyles, Tab, Tabs } from '@material-ui/core'
import FilterWrapper from '../Filters/FilterWrapper'
import AccordianFilters from '../Filters/AccordianFilters'
import FilterHeader from '../Filters/FilterHeader'
import Table2 from '../Tables/Table2'
import Table3 from '../Tables/Table3'
import TreeMap from '../charts/TreeMap'
import { addMonths } from '../../helpers'
import Axios from 'axios';

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
    const [sources,setSources] = useState(['Twitter','Newspaper'])
    const [source,setSource] = useState('Twitter')
    const [languages,setLanguages] = useState([])
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const [moods, setMoods] = useState({'joy':true,'sad':true,'anger':true,'anticipation':true,'disgust':true,'surprise':true,'fear':true,'trust':true})
    const [sentiments, setSentiments] = useState({'negative':true,'positive':true,'neutral':true})
    const [data, setData] = useState([])
    const [moodData, setMoodData] = useState([])
    const [sentimentData, setSentimentData] = useState([])


    const useStyles = makeStyles((theme) => ({
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
            borderColor: 'green', 
            color:'green',
            marginTop: '15px',
            marginBottom: '10px'
        }
    }));

    const parentSentiment = [{
      id: 'negative',
      name: 'Negative',
      color: "#EC2500"
  }, {
      id: 'positive',
      name: 'Positive',
      color: "#9EDE00"
  }, {
      id: 'neutral',
      name: 'Neutral',
      color: '#EC9800'
  }]
  const parentMood = [{
    id:'joy',
    name:'Joy',
    color:"rgb(0,255,0)"
  },{
    id:'sad',
    name:'sad',
    color:"rgb(236,240,22)"
  },{
    id:'anger',
    name:'anger',
    color:"rgb(240,22,37)"
  },{
    id:'anticipation',
    name:'anticipation',
    color:"rgb(29, 180, 240)"
  },{
    id:'disgust',
    name:'disgust',
    color:"rgb(226, 29, 240)"
  },{
    id:'surprise',
    name:'surprise',
    color:"rgb(240,124,29)"
  },{
    id:'fear',
    name:'fear',
    color:"rgb(0,0,0)"
  },{
    id:'trust',
    name:'trust',
    color:"rgb(217, 202, 202)"
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
              "terms": {
                "Source.keyword": ["twitter", "new-twitter"]
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
                      "field": "User.ScreenName.keyword"
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
                          ]
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
              console.log(res)
                setData(res.data.aggregations['date-based-range'].buckets[0].Users.buckets.map(doc => {
                    return {
                        influencer: doc.key,
                        posts:doc.Posts.value,
                        followers:doc.Followers.value,
                        engagement:doc.influenceWeight.value,
                        mood:doc.Moods.buckets[0].key,
                        sentiment:doc.Sentiment.buckets[0].key
                    }
                }))
                setMoodData(parentMood.concat(res.data.aggregations['date-based-range'].buckets[0].Users.buckets.map(doc => {
                  return {
                    name: doc.key,
                    posts:doc.Posts.value,
                    followers:doc.Followers.value,
                    parent:doc.Moods.buckets[0].key,
                    value:doc.influenceWeight.value
                }     
              })))
              setSentimentData(parentSentiment.concat(res.data.aggregations['date-based-range'].buckets[0].Users.buckets.map(doc => {
                return {
                    name: doc.key,
                    posts:doc.Posts.value,
                    followers:doc.Followers.value,
                    parent:doc.Sentiment.buckets[0].key,
                    value:doc.influenceWeight.value
                }
            })))
            })
            .catch(err => {
                console.log(err)
            })    
    } else {
        Axios.post(process.env.REACT_APP_URL,{
          "query": {
            "terms": {
              "Source.keyword": ["newspaper"]
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
                    "field": "SubSource.keyword"
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
                        ]
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
            console.log(res)
              setData(res.data.aggregations['date-based-range'].buckets[0].newspaperInfluencers.buckets.map(doc =>{
                  return {
                      newspaper:doc.key,
                      articles:doc.ArticleCount.value,
                      mood:doc.Mood.buckets[0].key,
                      sentiment:doc.Sentiment.buckets[0].key
                  }
              }))
              setMoodData(parentMood.concat(res.data.aggregations['date-based-range'].buckets[0].newspaperInfluencers.buckets.map(doc =>{
                return {
                    name:doc.key,
                    value:doc.ArticleCount.value,
                    parent:doc.Mood.buckets[0].key,
                }
            })))
            setSentimentData(parentSentiment.concat(res.data.aggregations['date-based-range'].buckets[0].newspaperInfluencers.buckets.map(doc =>{
              return {
                  name:doc.key,
                  value:doc.ArticleCount.value,
                  parent:doc.Sentiment.buckets[0].key,
              }
          })))
          })
          .catch(err => {
              console.log(err)
          })
    }
      },[from,to,source])
  
    return (
        <SideNav>
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
                                    <Grid item xs={8}>
                                        <CardContent>
                                            Top Influencers
                                        </CardContent>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel id="select-table"></InputLabel>
                                            <Select
                                                labelId="select-table"
                                                id="demo-simple-select-outlined"
                                                varient={'standard'}
                                                defaultValue={'top 15 influencers'}
                                                style={{borderColor: '#13A0FF', borderWidth: '2px', borderStyle: 'solid', color: '#13A0FF'}}
                                            >
                                                <MenuItem selected value='top 15 influencers'>Top 15 Influencers</MenuItem>
                                                <MenuItem value='top 30 influencers'>Top 30 influencers</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            source === 'Twitter' ? (<Table2 data={data} />) : (<Table3 data={data} />)
                                        }
                                        
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card className={classes.main}>
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={5}>
                                            <CardContent>Influncers Comparison</CardContent>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Tabs
                                                value={value}
                                                onChange={handleChange}
                                                indicatorColor="primary"
                                                textColor="primary"
                                                variant="scrollable"
                                                scrollButtons="auto"
                                                aria-label="scrollable auto tabs example"
                                            >
                                                <Tab label="Sentiment" {...a11yProps(0)} />
                                                <Tab label="Mood" {...a11yProps(1)} />
                                            </Tabs>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={11}>
                                    <TabPanel value={value} index={0}>
                                        <TreeMap data={sentimentData} />
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <TreeMap data={moodData} />
                                    </TabPanel>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={4} sm={12} >
                    <Grid container spacing={3} style={{position:'sticky',top:'60px'}} >
                        <Grid item xs={12} >
                            <FilterHeader refresh={[refresh,setRefresh]} />
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                            <AccordianFilters 
                              toFromDatesHandlers={[setFrom,setTo,addMonths]} 
                              radioSources={[source,setSource,sources]}
                                />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        </SideNav>
      )
}

export default InfluencerAnalysis
