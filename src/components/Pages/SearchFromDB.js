import { Button, Grid, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import ChipInput from 'material-ui-chip-input';
import MaterialTable from 'material-table';
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
        console.log('hello')
        if(keywords.length){
            Axios.post(process.env.REACT_APP_SEARCH_URL,{
                "query": {
                  "bool": {
                    "must": [
                      {"terms": {"HashtagEntities.Text.keyword": keywords}}
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
                setData(fetchedData.data.hits.hits.map((postObj)=>{
                    if(!postObj._source.User){
                        return {
                            date:dateFormatter(postObj._source.CreatedAt),
                            post:postObj._source.Text,
                            source:postObj._source.Source,
                            subSource:postObj._source.SubSource,
                            favouriteCount:postObj._source.FavoriteCount,
                            sentiment:postObj._source.predictedSentiment,
                            mood:postObj._source.predictedMood,
                            language:postObj._source.predictedLang
                        }
                    } else {
                        return {
                            date:dateFormatter(postObj._source.CreatedAt),
                            post:postObj._source.Text,
                            source:postObj._source.Source,
                            subSource:postObj._source.SubSource,
                            favouriteCount:postObj._source.FavoriteCount,
                            sentiment:postObj._source.predictedSentiment,
                            mood:postObj._source.predictedMood,
                            language:postObj._source.predictedLang,
                            followersCount:postObj._source.User.FollowersCount,
                            location:postObj._source.User.Location,
                            name:postObj._source.User.Name,
                            screenName:postObj._source.User.ScreenName
                        }
                    }
                })
            )})
              .catch(err => {
                  console.log(err)
              })
        } else {
            setData([])
        }
    }
    return (
        <Grid container>
                <Grid item xs={2} />
                <Grid item xs={8} align={'center'} style={{marginTop:'30px'}}>
                    <Typography variant={'h5'} style={{padding:'0 30px'}}>
                        Search With Keyword from Database
                    </Typography>
                    
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} />
                <Grid item xs={6} style={{marginTop:'20px'}}>
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
                <Button style={{backgroundColor:'rgb(67, 176, 42)',color:'white',height:'100%',marginLeft:'10px'}} onClick={() => fetchData()} fullWidth>
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
