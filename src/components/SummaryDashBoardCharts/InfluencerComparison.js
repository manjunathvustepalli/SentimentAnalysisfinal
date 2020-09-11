import React, { useState } from 'react'
import { Card, Grid, InputLabel, Select, MenuItem,makeStyles } from '@material-ui/core'
import TreeMap from '../charts/TreeMap'
import InlineFilter from '../Filters/InlineFilter'
import { green } from '@material-ui/core/colors';
import Axios from 'axios';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    filterDefault: {
        borderColor: "#43B02A",
        borderStyle: "solid",
        borderWidth: "1px",
        padding: '5px',
        color: "#43B02A",
    },
    filterColorDefault:{
        color: "#43B02A"
    },
}));

function InfluencerComparison({from,to}) {
    const classes = useStyles();
    const [source, setSource] = useState('twitter')
    const [type, setType] = useState('Sentiment')
    const [data, setData] = useState([])
    var colors = {
        'joy':green[800],
        'sad':'rgba(236, 240, 22)',
        'anger':'rgba(240, 22, 37)',
        'anticipation':'rgba(29, 180, 240)',
        'disgust':'rgba(226, 29, 240)',
        'surprise':'rgba(240, 124, 29)',
        'fear':'#616C6F',
        'trust':'rgba(217, 202, 202)',
        'positive':green[800],
        'negative':'rgba(255,0,0)',
        'neutral':'rgba(235,255,0)'
      }
    
    const parent = [{
        id: 'negative',
        name: 'Negative',
        color: "#EC2500",
        dataLabels:{
          color:'#000',
          style:{
              textOutline:'none'
          }
      }
    }, {
        id: 'positive',
        name: 'Positive',
        color: "#9EDE00",
        dataLabels:{
          color:'#000',
          style:{
              textOutline:'none'
          }
      }
    }, {
        id: 'neutral',
        name: 'Neutral',
        color: '#EC9800',
        dataLabels:{
          color:'#000',
          style:{
              textOutline:'none'
          }
      }
    },{
      id:'joy',
      name:'Joy',
      color:"rgb(0,255,0)",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'sad',
      name:'sad',
      color:"rgb(236,240,22)",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'anger',
      name:'anger',
      color:"rgb(240,22,37)",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'anticipation',
      name:'anticipation',
      color:"rgb(29, 180, 240)",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'disgust',
      name:'disgust',
      color:"rgb(226, 29, 240)",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'surprise',
      name:'surprise',
      color:"rgb(240,124,29)",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'fear',
      name:'fear',
      color:"#616C6F",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'trust',
      name:'trust',
      color:"rgb(217, 202, 202)",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    }]

    useEffect(() => {
        if(source === 'twitter'){
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
                    setData(parent.concat(res.data.aggregations['date-based-range'].buckets[0].Users.buckets.map(doc => {
                          return {
                              name: doc.key,
                              parent:doc[type].buckets[0].key,
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
                  setData(parent.concat(res.data.aggregations['date-based-range'].buckets[0].newspaperInfluencers.buckets.map(doc =>{
                    return {
                        name:doc.key,
                        value:doc.ArticleCount.value,
                        parent:doc[type].buckets[0].key,
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
          },[from,to,source,type])

    return (
        <Card style={{color:"#CB0038",fontWeight:'bold',fontSize:'16px'}} >
        <Grid container spacing={3} > 
            <Grid item xs={5} style={{height:'90px',lineHeight:'90px',padding:'35px'}} >
                Influence Comparison
            </Grid>
            <Grid item xs={7}  >
                <Grid container style={{marginTop:'30px'}}>
                <Grid item xs={4} >
                <InputLabel id="select-source" className={classes.filterColorDefault} >Source</InputLabel>
                    <Select 
                    labelId="select-source"
                    id="select-source-main"
                    fullWidth
                    className={classes.filterDefault}
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    >
                       <MenuItem value={'twitter'} > Twitter </MenuItem>                    
                       <MenuItem value={'newspaper'} > Newspaper </MenuItem>                    
                    </Select>
                </Grid>
            <Grid item xs={1}/>
            <Grid item xs={4}>
                <InputLabel id="Select-type"className={classes.filterColorDefault} >Select Type </InputLabel>
                    <Select
                    labelId="Select-type"
                    id="demo-simple-select-helper"
                    fullWidth
                    className={classes.filterDefault}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    >
                    <MenuItem value='Sentiment'>Sentiment</MenuItem>
                    <MenuItem value='Mood'>Mood</MenuItem>
                    </Select>
            </Grid>
                </Grid>
            </Grid>
        </Grid>
        <TreeMap data={data}/>
    </Card>
    )
}

export default InfluencerComparison
