import { Button, Grid, } from '@material-ui/core';
import React, { useState } from 'react'
import ChipInput from 'material-ui-chip-input';
import Axios from 'axios';
import MaterialTable from 'material-table';
import Loader from '../LoaderWithBackDrop'
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


function GlobalSearch() {
    const [source, setSource] = useState('twitter');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [handles, setHandles] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [open, setopen] = useState(false)


    const submitData = () => {
        setopen(true)
        if(source === 'twitter'){
            Axios.post(process.env.REACT_APP_SEARCH_URL,{
                "query": {
                  "bool": {
                    "must": [
                      {"terms": {"Source.keyword": [source]}},
                      {"terms": {"User.ScreenName.keyword": handles}},
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
              .then(data =>{
                  console.log(data.data)
                setData(data.data.hits.hits.map((postObj)=>{
                    if(!postObj._source.User){
                        return {
                            date:dateFormatter(postObj._source.CreatedAt),
                            post:postObj._source.Text,
                            favouriteCount:postObj._source.FavoriteCount,
                            sentiment:postObj._source.predictedSentiment,
                            mood:postObj._source.predictedMood,
                            language:postObj._source.predictedLang
                        }
                    } else {
                        return {
                            date:dateFormatter(postObj._source.CreatedAt),
                            post:postObj._source.Text,
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
                }))
                setColumns([
                    {
                        title:'Date',
                        field:'date',   
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
                        title:'Followers Count',
                        field:'followersCount',   
                    },
                    {
                        title:'Location',
                        field:'location',   
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
                setopen(false)
            })
              .catch(err =>{
                  console.log(err)
              })
        }else if(source === 'facebook') {
            setopen(true)
            Axios.post(process.env.REACT_APP_SEARCH_URL,{
                "query": {
                  "bool": {
                    "must": [
                      {"terms": {"Source.keyword": [source]}},
                      {"terms": {"SubSource.keyword": handles}},
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
              .then(data=>{
                console.log(data.data)
                setData(data.data.hits.hits.map((postObj,i)=>{
                    return {
                        id:i,
                        date:dateFormatter(postObj._source.CreatedAt),
                        post:postObj._source.Text,
                        favouriteCount:postObj._source.FavoriteCount,
                        sentiment:postObj._source.predictedSentiment,
                        mood:postObj._source.predictedMood,
                        language:postObj._source.predictedLang,
                        screenName:postObj._source.SubSource
                    }
                }))
                setColumns([
                                {
                                    title:'Date',
                                    field:'date',   
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
                setopen(false)            
                })
              .catch(err =>{
                  console.log(err)
              })            
        }else if(source === 'newspaper') {
            setopen(true)
            Axios.post(process.env.REACT_APP_SEARCH_URL,{
                "query": {
                  "bool": {
                    "must": [
                      {"terms": {"Source.keyword": [source]}},
                      {"terms": {"SubSource.keyword": handles}},
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
              .then(data=>{
                console.log(data.data)
                setData(data.data.hits.hits.map((postObj,i)=>{
                    return {
                        id:i,
                        date:dateFormatter(postObj._source.CreatedAt),
                        post:postObj._source.Text,
                        favouriteCount:postObj._source.FavoriteCount,
                        sentiment:postObj._source.predictedSentiment,
                        mood:postObj._source.predictedMood,
                        language:postObj._source.predictedLang,
                        screenName:postObj._source.SubSource,
                        url:<a target="_blank" rel="noopener noreferrer" style={{textDecoration:'none',color:'white'}} href={postObj._source.URLEntities[0].URL}>
                        <Button
                          endIcon={<LaunchIcon/>}
                    > Open Post </Button> 
                      </a>
                    }
                }))
                setColumns([
                                {
                                    title:'Date',
                                    field:'date',   
                                },
                                {
                                    title:'Post',
                                    field:'post',
                                },
                                {
                                    title:'Url',
                                    field:'url'
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
                setopen(false)            
                })
              .catch(err =>{
                  console.log(err)
              })            
        }
    }

    return (
        <>
            <Loader open={open} />
            <Grid container spacing={3} style={{padding:'30px'}}>
            <Grid item xs={10}>
                <Grid container>
                    <Grid item xs={4} sm={3} md={2} lg={2}
                            onClick={() => {
                                setData([])
                                setSource('twitter')
                                setKeywords([])
                                setHandles([])
                            }}
                            style={{backgroundColor:source==='twitter'?'rgb(67,176,42)':'',cursor:'pointer',border:'2px solid rgb(67,176,42)',color:source==='twitter'?'white':'black', height:'50px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>
                        TWITTER
                    </Grid>
                    <Grid item xs={4} sm={3} md={2} lg={2} 
                        onClick={() => {
                            setData([])
                            setSource('facebook')
                            setKeywords([])
                            setHandles([])
                        }}
                        style={{backgroundColor:source==='facebook'?'rgb(67,176,42)':'',cursor:'pointer',border:'2px solid rgb(67,176,42)',color:source==='facebook'?'white':'black',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>
                        FACEBOOK
                    </Grid>
                    <Grid item xs={4} sm={3} md={2} lg={2} 
                        onClick={() => {
                            setData([])
                            setSource('newspaper')
                            setKeywords([])
                            setHandles([])
                        }}
                        style={{backgroundColor:source==='newspaper'?'rgb(67,176,42)':'',cursor:'pointer',border:'2px solid rgb(67,176,42)',color:source==='newspaper'?'white':'black',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>
                        NEWSPAPER
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2} sm={false} />
            <Grid item sm={12} md={4} lg={3}>
                        <ChipInput 
                        fullWidth
                        variant="outlined"
                        blurBehavior="add"
                        label={`Type ${source} Handle`}
                        value={handles}
                        onAdd={(chip) =>{
                            setHandles(prev => [...prev,chip])
                        }}
                        onDelete={(chip,i) =>{
                            setHandles(prev => {
                                let data = [...prev]
                                data.splice(i,1)
                                return data
                            })
                        }}
                    />

            </Grid>
                    <Grid item sm={12} md={4} lg={3} >
                        <ChipInput 
                        fullWidth
                        blurBehavior="add"
                        variant="outlined"
                        label="Type Keywords"
                        value={keywords}
                        onAdd={(chip) =>{
                            setKeywords(prev => [...prev,chip])
                        }}
                        onDelete={(chip,i) =>{
                            setKeywords(prev => {
                                let data = [...prev]
                                data.splice(i,1)
                                return data
                            })
                        }}
                    />
                    </Grid>
            <Grid item  xs={12} md={2} >
                <Button style={{backgroundColor:'rgb(67, 176, 42)',color:'white',height:'100%'}} onClick={() => submitData()} fullWidth>
                    Search
                </Button>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={12}>
                <div style={{width:'100%'}}>
                <MaterialTable
                style={{
                    padding:'20px'
                }}
                title='Search Results'
                columns={columns}
                data={data}
                options={{
                    paging:false,
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
                </div>
            </Grid>
        </Grid>
        </>    
    )
}

export default GlobalSearch
