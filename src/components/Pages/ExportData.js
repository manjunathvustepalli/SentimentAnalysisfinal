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
import { addMonths } from '../../helpers'


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

function ExportData() {

    const classes = useStyles();
    const [data, setData] = useState([])
    const [liveReloading, setLiveReloading] = useState(false)
    const [reloadInterval, setReloadInterval] = useState(10000)
    const [to, setTo] = useState(addMonths(new Date(),0))
    const [from, setFrom] = useState(addMonths(new Date(),0))

    function fetchData(){
        Axios.post(process.env.REACT_APP_SEARCH_URL,{
            "aggs": {
              "date-based-range": {
                "date_range": {
                  "field": "CreatedAt",
                  "format": "dd-MM-yyyy",
                  "ranges": [
                    { "from":from, "to": to }
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
                return obj
            })
            setData(final)
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
            <Card style={{padding:'20px'}}>
                <Grid container spacing={5} style={{width:'80vw'}}>
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
                    <TextField label="Enter Keyword" />
                    <Button style={{transform:"translateY(5px)"}} className={classes.button} >
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
                    {/* <Grid item md={3} xs={12}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Sentiment</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="Reload Interval "
                                >
                                    <MenuItem value={'positive'}>Positive</MenuItem>
                                    <MenuItem value={'negative'}>Negative</MenuItem>
                                    <MenuItem value={'neutral'}>Neutral</MenuItem>
                                </Select>
                        </FormControl>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Mood</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="Reload Interval "
                                >
                                    <MenuItem value={'positive'}>Joy</MenuItem>
                                    <MenuItem value={'negative'}>Sad</MenuItem>
                                    <MenuItem value={'neutral'}>Anticipation</MenuItem>
                                    <MenuItem value={'neutral'}>Disgust</MenuItem>
                                    <MenuItem value={'neutral'}>Anticipation</MenuItem>
                                </Select>
                        </FormControl>
                    </Grid> */}
                    <Grid item xs={12}>
                        <MaterialTable 
                            title='Export Data'
                            columns={[
                                {title:'Name',field:'name',editable:'never'},
                                {title:'Screen Name',field:'screenName',editable:'never',cellStyle: { whiteSpace: "nowrap" },
                                headerStyle: { whiteSpace: "nowrap" }},
                                {title:'Tweet',field:'tweet',editable:'never'},
                                {title:'Followers Count',field:'followersCount',editable:'never',cellStyle: { whiteSpace: "nowrap" },
                                headerStyle: { whiteSpace: "nowrap" }},
                                {title:'Retweet Count',field:'retweetCount',editable:'never',cellStyle: { whiteSpace: "nowrap" },
                                headerStyle: { whiteSpace: "nowrap" }},
                                {title:'Mood(Predicted)',field:'mood',editable:"never" },
                                {title:'Mood(Manual)',field:'manualMood', lookup:{'joy':'Joy','anger':'Anger','surprise':'Surprise','anticipation':'Anticipation','trust':'Trust','sad':'Sad','disgust':'Disgust','fear':'Fear'} },
                                {title:'Sentiment(Predicted)',field:'sentiment',editable:"never"},
                                {title:'Sentiment(Manual)',field:'manualSentiment',lookup:{'positive':'Positive','negative':'Negative','neutral':'Neutral'}},
                            ]}
                            data={data}
                            options={{
                                grouping:!liveReloading,
                                paging:false,
                                exportButton: true,
                                maxBodyHeight:500,
                                headerStyle:{
                                    backgroundColor:green[800],
                                    color:'white',
                                    paddingTop:'10px',
                                    paddingBottom:'10px',
                                }
                            }}
                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            const dataUpdate = [...data];
                                            const index = oldData.tableData.id;
                                            dataUpdate[index] = newData;
                                            setData([...dataUpdate]);
                        
                                            resolve();
                                        }, 1000);
                                    })
                            }}
                        />
                    </Grid>
                </Grid>
            </Card>
        </SideNav>
    )
}

export default ExportData
