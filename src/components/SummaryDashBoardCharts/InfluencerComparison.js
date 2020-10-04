import React, { useState } from 'react'
import { Card, Grid, InputLabel, Select, MenuItem,makeStyles, FormControl} from '@material-ui/core'
import TreeMap from '../charts/TreeMap'
import Axios from 'axios';
import { useEffect } from 'react';
import { capitalizeString } from '../../helpers';
import CustomLegend from '../CustomLegend';
import colors from '../../helpers/colors'

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

function InfluencerComparison({from,to,refresh}) {
    const classes = useStyles();
    const [source, setSource] = useState('twitter')
    const [type, setType] = useState('Sentiment')
    const [data, setData] = useState([])
    const [size, setSize] = useState(10)
 
    const parent = [{
        id: 'negative',
        name: 'Negative',
        color: "#CB0038",
        dataLabels:{
          color:'#000',
          style:{
              textOutline:'none'
          }
      }
    }, {
        id: 'positive',
        name: 'Positive',
        color: "#04E46C",
        dataLabels:{
          color:'#000',
          style:{
              textOutline:'none'
          }
      }
    }, {
        id: 'neutral',
        name: 'Neutral',
        color: '#FFC400',
        dataLabels:{
          color:'#000',
          style:{
              textOutline:'none'
          }
      }
    },{
      id:'joy',
      name:'Joy',
      color:"#4C7A00",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'sad',
      name:'sad',
      color:"#D8D8D8",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'anger',
      name:'anger',
      color:"#FF5151",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'anticipation',
      name:'anticipation',
      color:"#111D31",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'disgust',
      name:'disgust',
      color:"#D512CF",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'surprise',
      name:'surprise',
      color:"#FF6600",
      dataLabels:{
        color:'#000',
        style:{
            textOutline:'none'
        }
    }
    },{
      id:'fear',
      name:'fear',
      color:"#2000FF",
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
        setData([])
        if(source === 'twitter'){
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
                          "size":100
                        },
                        "aggs": {
                          "Followers": {
                            "max": {
                              "field": "User.FollowersCount",
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
                              parent: doc[type].buckets[0] ? doc[type].buckets[0].key : 'unknown',
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
                    console.log(err,err.response)
                })    
        } else {
            Axios.post(process.env.REACT_APP_URL,{
              "query": {
                "terms": {
                  "Source.keyword": [source]
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
                  setData(parent.concat(res.data.aggregations['date-based-range'].buckets[0].newspaperInfluencers.buckets.map(doc =>{
                    return {
                        name:doc.key,
                        value:doc.ArticleCount.value,
                        parent: doc[type].buckets[0] ? doc[type].buckets[0].key : 'unknown',
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
          },[from,to,source,type,size,refresh])

    return (
        <Card style={{color:"#CB0038",fontWeight:'bold',fontSize:'16px'}} >
        <Grid container spacing={1}> 
            <Grid item xs={4} style={{height:'70px',lineHeight:'70px',padding:'10px'}} >
                Influence Comparison
            </Grid>
            <Grid item xs={8}  > 
                <Grid container style={{marginTop:'15px'}}>
                <Grid item xs={4} style={{padding:'5px'}}>
                  <FormControl variant="outlined" style={{width:'100%'}} >
                    <InputLabel id="select-source" >Source</InputLabel>
                      <Select 
                        labelId="select-source"
                        label="Source"
                        id="select-source-main"
                        fullWidth
                        value={source}
                        style={{fontSize:'7px',height:'30px'}}
                        onChange={(e) => setSource(e.target.value)}
                      >
                        <MenuItem value={'twitter'}  > Twitter </MenuItem>                    
                        <MenuItem value={'newspaper'} > Newspaper </MenuItem>                    
                        <MenuItem value={'facebook'} > Facebook </MenuItem>                    
                    </Select>
                  </FormControl>
                </Grid>
            <Grid item xs={4} style={{padding:'5px'}}>
              <FormControl variant="outlined" style={{width:'100%',}} >
              <InputLabel id="Select-type">Type </InputLabel>
                    <Select
                    variant="outlined"
                    labelId="Select-type"
                    label="Type"
                    id="demo-simple-select-helper"
                    fullWidth
                    style={{fontSize:'7px',height:'30px'}}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    >
                    <MenuItem value='Sentiment' >Sentiment</MenuItem>
                    <MenuItem value='Mood'>Mood</MenuItem>
                    </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} style={{padding:'5px'}} >
              <FormControl variant="outlined" style={{width:'100%'}} >
              <InputLabel id="Select-count">Count </InputLabel>
                    <Select
                    variant="outlined"
                    labelId="Select-count"
                    label="Count"
                    id="demo-simple-select-helper"
                    style={{fontSize:'7px',height:'30px'}}
                    fullWidth
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    >
                    <MenuItem value={10}>Top 10  </MenuItem>
                    <MenuItem value={25}>Top 25 </MenuItem>
                    <MenuItem value={50}>Top 25 </MenuItem>
                    </Select>
              </FormControl>
            </Grid>
          </Grid>
            </Grid>
            <Grid item xs={12}>
            <TreeMap title={`${capitalizeString(source)} Influencer Comparison`} data={data}/>
            <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {
                type === 'Sentiment' ? (
                  ['positive','negative','neutral'].map((sentiment) => <CustomLegend word={capitalizeString(sentiment)} color={colors[sentiment]} />)
                ) : (
                  ['joy','surprise','anticipation','sad','anger','disgust','fear','trust'].map((mood)=> <CustomLegend word={capitalizeString(mood)} color={colors[mood]} />)
                )
              }
            </div>
            </Grid>
        </Grid>
    </Card>
    )
}

export default InfluencerComparison
