import React, { useState,useEffect } from 'react'
import SideNav from '../Navigation/SideNav'
import { Card, Grid, TextField } from '@material-ui/core'
import MaterialTable from 'material-table'
import Axios from 'axios'

function LiveAnalysis() {

    const [data, setData] = useState([])

    function fetchData(){
        Axios.post('http://3.7.187.244:9200/analyzed-docs/_search',{
            "aggs": {
              "date-based-range": {
                "date_range": {
                  "field": "CreatedAt",
                  "format": "dd-MM-yyyy",
                  "ranges": [
                    { "from":"now-1d/d", "to": "now" }
                  ]
                }
              }
            },
            "from": 1000
          })
        .then(fetchedData => {
            let final =  fetchedData.data.hits.hits.map(user => {
                let obj = {}
                obj.name =  user._source.User.Name
                obj.screenName =  user._source.User.ScreenName
                obj.tweet =  user._source.Text
                obj.followersCount =  user._source.User.FollowersCount
                obj.retweetCount =  user._source.RetweetCount
                obj.mood = user._source.predictedMood
                obj.sentiment = user._source.predictedSentiment
                console.log(obj.name)
                return obj
            })
            setData(final)
        })

    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(() => {
            fetchData()
          }, 10000);
          return () => clearInterval(interval);
    }, [])

    return (
        <SideNav>
            <Card>
                <Grid container spacing={5} style={{margin:'20px 0'}}>
                    <Grid item lg={3} md={2} sm={1} xs={false}>

                    </Grid>
                    <Grid item lg={6} md={8} sm={10} xs={12} align='center'>
                        <TextField 
                            type='text'
                            fullWidth
                            variant='standard'
                            label='Enter Keyword'
                        />
                    </Grid>
                    <Grid item lg={3} md={2} sm={1} xs={false}>
                    </Grid>
                    <Grid item xs={12}>
                        <MaterialTable 
                            title='Live Analysis'
                            columns={[
                                {title:'Name',field:'name'},
                                {title:'Screen Name',field:'screenName'},
                                {title:'Tweet',field:'tweet'},
                                {title:'Followers Count',field:'followersCount'},
                                {title:'Retweet Count',field:'retweetCount'},
                                {title:'Mood',field:'mood'},
                                {title:'Sentiment',field:'sentiment'},
                            ]}
                            data={data}
                            options={{
                                grouping:true
                            }}
                        />
                    </Grid>
                </Grid>
            </Card>
        </SideNav>
    )
}

export default LiveAnalysis
