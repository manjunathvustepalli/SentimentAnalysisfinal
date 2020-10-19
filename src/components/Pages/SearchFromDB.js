import { Button, Chip, Grid, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import ChipInput from 'material-ui-chip-input';
import MaterialTable from 'material-table';
import { getKeyArray } from '../../helpers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Auth} from './Auth'

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

function SearchFromDB() {
    const [keywords, setKeywords] = useState([])
    const [data, setData] = useState([])
    const [sources, setSources] = useState([])
    const [selectedSources, setSelectedSources] = useState([])
    const [handles, setHandles] = useState([])
    const [columns, setColumns] = useState([
        {
            title:'Date',
            field:'date',   
        },
        {
            title:'Source',
            field:'source'
        },
        {
            title:'Sub Source',
            field:'subSource'
        },
        {
            title:'Name',
            field:'name',   
        },
        {
            title:'Screen Name',
            field:'screenName',
        },
        {
            title:'Post',
            field:'post',
        },
        {
            title:'Sentiment',
            field:'sentiment',   
        },
        {
            title:'Mood',
            field:'mood',   
        },
        {
            title:'Language',
            field:'language',   
        }
    ])

    const fetchData = () => {
        let query = {
            "query": {
              "bool": {
                "must": [
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
          }
          if(selectedSources.length){
              query.query.bool.must.push({
                "terms": {"Source.keyword":selectedSources}  
              })
          }
          if(selectedSources.length === 1 && handles.length){
            if(selectedSources[0] === 'twitter' || selectedSources[0] === 'new-twitter'){
                query.query.bool.must.push({
                    "terms": {"User.ScreenName.keyword":handles}  
                  })
            }else{
                query.query.bool.must.push({
                    "terms": {"SubSource.keyword":handles}  
                })
            }
          }
          if(keywords.length){
            query.query.bool.must.push({
                "terms": {"HashtagEntities.Text.keyword":keywords}  
            })
          }
            Axios.post(
              
                process.env.REACT_APP_SEARCH_URL,
              query,Auth
            )
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

    useEffect(() => {
        Axios.post(
          process.env.REACT_APP_URL,
          {
            aggs: {
              Source: {
                terms: {
                  field: "Source.keyword",
                },
              },
            },
          },Auth
        )
          .then((data) => {
            setSources(getKeyArray(data.data.aggregations.Source.buckets));
          })
          .catch((err) => {
            console.log(err);
          });
      }, [])
  
    return (
        <Grid container>
                <Grid item xs={2} />
                <Grid item xs={8} align={'center'} style={{marginTop:'30px'}}>
                    <Typography variant={'h5'} style={{padding:'0 30px'}}>
                        Search With Keyword from Database
                    </Typography>
                    
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={1} />
                <Grid item xs={3} style={{marginTop:'20px'}}>
                <div style={{width:'100%',padding:'0 10px'}}>
                              <Autocomplete
                              multiple
                              fullWidth
                              id="tags-outlined"
                              value={selectedSources}
                              onChange={(e,arr) => {
                                if(arr.includes('All')){
                                    setSelectedSources([...sources])
                                } else {
                                    setSelectedSources(arr)
                                }
                              }}
                              options={[...sources,'All']}
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
                                  label="Select Sources"
                                  placeholder="Sources"
                                />
                              )}
                            />
                          </div>
                </Grid>
                {
                    selectedSources.length === 1 ? (
                        <Grid item xs={2} style={{marginTop:'20px',marginLeft:'10px'}}>
                        <ChipInput
                            fullWidth
                            variant="outlined"
                            label={`Type ${selectedSources[0] ? selectedSources[0] : '' } Handle to Search`}
                            defaultValue={handles}                        
                            onChange={(chips) => {
                                setHandles(chips)
                            }}
                        />
                    </Grid>       
                    ) : (
                        <span/>
                    ) 
                }
                <Grid item xs={2} style={{marginTop:'20px',marginLeft:'10px'}}>
                    <ChipInput
                        fullWidth
                        variant="outlined"
                        label="Type Keyword to Search"
                        defaultValue={keywords}                        
                        onChange={(chips) => {
                            setKeywords(chips)
                        }}
                    />
                </Grid>
                <Grid item xs={2} style={{marginTop:'20px'}}>
                <Button style={{backgroundColor:'rgb(67, 176, 42)',color:'white',height:'50px',marginLeft:'10px'}} onClick={() => fetchData()} fullWidth>
                    Search
                </Button>
                </Grid>    
                <Grid item xs={2} />
                <Grid item xs={12} style={{marginTop:'20px',padding:'30px'}} >
                        <MaterialTable
                            title='Search Results'
                            columns={columns}
                            data={data}
                            style={{padding:'20px'}}
                            options={{
                                tableLayout:"fixed",
                                maxBodyHeight:500,
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
    )
}

export default SearchFromDB
