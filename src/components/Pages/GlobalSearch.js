import { Button, Chip, Grid, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import SideNav from '../Navigation/SideNav';
import ChipInput from 'material-ui-chip-input';
import Axios from 'axios';
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


function GlobalSearch() {
    const [source, setSource] = useState('twitter');
    const [keywords, setKeywords] = useState([]);
    const [handles, setHandles] = useState([]);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [twitterHandles, setTwitterHandles] = useState([])
    const [facebookHandles, setFacebookHandles] = useState([])

    const submitData = () => {
        let keywordsString = keywords.join(',')
        let handlesString = handles.join(',')
        console.log(keywordsString,handlesString,source)
        if(source === 'twitter'){
            Axios.get(`http://cors-anywhere.herokuapp.com/http://arijit-224b3922.localhost.run/bsma-webservice/fetchdatafromtwitter?keywords=${keywordsString}&handles=${handlesString}`)
                .then(res =>{
                    console.log(res)
                    if(res.data.status === 'ACCEPTED'){
                        Axios.post(process.env.REACT_APP_SEARCH_URL,{
                            "query": {
                              "bool": {
                                "must": [
                                  {"terms": {"Source.keyword": ["twitter"]}},
                                  {"terms": {"User.ScreenName.keyword": twitterHandles}}
                                ],
                                "should": [
                                  {"terms": {"Text.keyword": keywords}}
                                ]
                              }
                            },
                            "size": 50
                          })
                          .then(data =>{
                              console.log(data)
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
                          })
                          .catch(err =>{
                              console.log(err)
                          })
                    }
                })
                .catch(err =>{
                    console.log(err.response)
                })
        } else if(source === 'facebook') {
            Axios.get(`http://cors-anywhere.herokuapp.com/http://arijit-224b3922.localhost.run/bsma-webservice/fetchdatafromfb?fbpage=${handlesString}`)
                .then(res =>{
                    console.log(res)
                    if(res.data.status === 'ACCEPTED'){
                        Axios.post(process.env.REACT_APP_SEARCH_URL,{
                            "query": {
                              "bool": {
                                "must": [
                                  {"terms": {"Source.keyword": ["facebook"]}},
                                  {"terms": {"SubSource.keyword": facebookHandles }}
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
                            console.log(data)
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
                        })
                          .catch(err =>{
                              console.log(err)
                          })
                    }
                })
                .catch(err =>{
                    console.log(err.response)
                })
        }
    }

    return (
        <SideNav>
            <Grid container spacing={3} style={{padding:'30px'}}>
            <Grid item xs={10}>
                <Grid container>
                    <Grid item xs={4} sm={3} md={2} lg={2}
                            onClick={() => {
                                setData([])
                                setSource('twitter')
                                setKeywords([])
                                setTwitterHandles([])
                                setFacebookHandles([])
                            }}
                            style={{backgroundColor:source==='twitter'?'rgb(67,176,42)':'',cursor:'pointer',border:'2px solid rgb(67,176,42)',color:source==='twitter'?'white':'black', height:'50px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>
                        TWITTER
                    </Grid>
                    <Grid item xs={4} sm={3} md={2} lg={2} 
                        onClick={() => {
                            setData([])
                            setSource('facebook')
                            setKeywords([])
                            setTwitterHandles([])
                            setFacebookHandles([])
                        }}
                        style={{backgroundColor:source==='facebook'?'rgb(67,176,42)':'',cursor:'pointer',border:'2px solid rgb(67,176,42)',color:source==='facebook'?'white':'black',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>
                        FACEBOOK
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2} sm={false} />
            <Grid item sm={12} md={4} lg={3}>
                {
                    source === 'twitter' ? (
                        <ChipInput 
                        fullWidth
                        variant="outlined"
                        blurBehavior="add"
                        label="Type Twitter Screen Names"
                        value={twitterHandles}
                        onAdd={(chip) =>{
                            setTwitterHandles(prev => [...prev,chip])
                        }}
                        onDelete={(chip,i) =>{
                            setTwitterHandles(prev => {
                                let data = [...prev]
                                data.splice(i,1)
                                return data
                            })
                        }}
                    />
                    ) : (
                        <ChipInput 
                        fullWidth
                        variant="outlined"
                        blurBehavior="add"
                        label="Type Facebook Screen Names"
                        value={facebookHandles}
                        onAdd={(chip) =>{
                            setFacebookHandles(prev => [...prev,chip])
                        }}
                        onDelete={(chip,i) =>{
                            setFacebookHandles(prev => {
                                let data = [...prev]
                                data.splice(i,1)
                                return data
                            })
                        }}
                    />
                    )
                }

            </Grid>
                {
                    source === 'twitter' ? (
                    <Grid item sm={12} md={4} lg={3} >
                        <ChipInput 
                        fullWidth
                        blurBehavior="add"
                        variant="outlined"
                        label="Type Keywords"
                        defaultValue={[]}   
                        onChange={(chips) => {
                            setKeywords(chips)
                        }}
                    />
                    </Grid>
                    ) : ('')
                }
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
        </SideNav>    
    )
}

export default GlobalSearch
