import React, { useState,useEffect } from 'react'
import SideNav from '../Navigation/SideNav'
import { Card, Grid, Switch, FormControlLabel, TextField, Button } from '@material-ui/core'
import MaterialTable from 'material-table'
import Axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { green } from '@material-ui/core/colors'
import GridTimeFilter from '../Filters/GridTimeFilter'

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    button:{
        margin: theme.spacing(1),
        color:'white',
        textAlign:'center',
        backgroundColor:green[800],
        '&:hover': {
            backgroundColor:green[800],
        }
    }
  }));

function LiveAnalysis() {

    const classes = useStyles();
    const [data, setData] = useState([])
    const [liveReloading, setLiveReloading] = useState(false)
    const [reloadInterval, setReloadInterval] = useState(10000)
    const [to, setTo] = useState(new Date())
    const [from, setFrom] = useState(new Date())
    const [keyword, setKeyword] = useState('')

    function fetchData(){
        Axios.post(process.env.REACT_APP_SEARCH_URL,{
            "aggs": {
              "date-based-range": {
                "date_range": {
                  "field": "CreatedAt",
                  "format": "dd-MMM-yyyy",
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

    function fetchFromKeyword(){
        Axios.post(process.env.REACT_APP_SEARCH_URL,{
            "query": {
              "multi_match": {
                "query": keyword,
                "type": "phrase", 
                "fields": ["bn", "en", "Source.keyword", "SubSource.keyword", "User.ScreenName.keyword"]
              }
            }
          })
          .then(fetchedData =>{
              console.log(fetchedData)
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
                console.log(obj.name)
                return obj
            })
            setData(final)
          })
          .catch(err => {
              console.log(err)
          })
    }



    useEffect(() => {
        fetchData()
        const interval = setInterval(() => {
            if(liveReloading){
                fetchData()
            }
          }, reloadInterval);
          return () => clearInterval(interval);
    }, [reloadInterval,liveReloading])

    return (
        <SideNav>
            <Card>
                <Grid container spacing={2} style={{padding:'20px'}}>
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
                    <Grid item xs={4} align='right' direction='row'>
                    <TextField label="Enter Keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    <Button style={{transform:"translateY(5px)"}} className={classes.button} onClick={() => fetchFromKeyword()} >
                        Search
                    </Button>
                    </Grid>
                    <Grid item xs={4} align="left">
                        <GridTimeFilter toFromDatesHandlers={[setTo,setFrom]} />
                    </Grid>
                    <Grid item xs={2} align="right">
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
                                grouping:!liveReloading,
                                paging:false,
                                maxBodyHeight:500
                            }}
                        />
                    </Grid>
                </Grid>
            </Card>
        </SideNav>
    )
}

export default LiveAnalysis
