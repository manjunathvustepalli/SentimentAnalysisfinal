import React, { useState,useEffect } from 'react'
import { Card, Grid, Switch, FormControlLabel } from '@material-ui/core'
import MaterialTable from 'material-table'
import Axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { addMonths } from '../../helpers'
import FilterHeader from '../Filters/FilterHeader'
import FilterWrapper from '../Filters/FilterWrapper'
import AccordianFilters from '../Filters/AccordianFilters'
import {Auth} from './Auth'
import Cookies from 'js-cookie'

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
        backgroundColor:'rgb(67, 176, 42)',
        '&:hover': {
            backgroundColor:'rgb(67, 176, 42)',
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
    const [sources, setSources] = useState({"twitter":true,"facebook":true})
    const [languages, setLanguages] = useState({"english":true,"hindi":false})
    const [subSources, setSubSources] = useState({"twitter for android":true,"TimesOfIndia":false})
    const [refresh, setRefresh] = useState(true)


    function fetchData(){
        let selectedSources = []
        Object.keys(sources).forEach(source =>{
            sources[source] && (selectedSources.push(source))
        })

        let selectedSubSources = []
        Object.keys(subSources).forEach(subSource =>{
            subSources[subSource] && (selectedSubSources.push(subSource))
        })

        let selectedlanguages = []
        Object.keys(languages).forEach(language =>{
            languages[language] && (selectedlanguages.push(language))
        })

        // Axios.post(process.env.REACT_APP_SEARCH_URL,{
        //     "query": {
        //       "match_all": {}
        //     },
        //     "size": 10,
        //     "sort": [
        //       {
        //         "CreatedAt": {
        //           "order": "desc"
        //         }
        //       }
        //     ]
        //   }, Auth)
        let token=Cookies.get("token")
        let config = {
          method: "post",
          url: process.env.REACT_APP_URL + "query/exportdata",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          data: "",
        };

        Axios(config).then((fetchedData) => {
          let final = fetchedData.data.hits.hits.map((user) => {
            let obj = {};
            if (user._source.User) {
              obj.name = user._source.User.Name;
              obj.screenName = user._source.User.ScreenName;
              obj.followersCount = user._source.User.FollowersCount;
            }
            obj.date = dateFormatter(user._source.CreatedAt);
            obj.tweet = user._source.Text;
            obj.retweetCount = user._source.RetweetCount;
            obj.mood = user._source.predictedMood;
            obj.sentiment = user._source.predictedSentiment;
            return obj;
          });
          setData(final);
        });

    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(() => {
            if(liveReloading){
                fetchData()
            }
          }, reloadInterval);
          return () => clearInterval(interval);
    }, [reloadInterval,liveReloading,languages,sources,subSources])

    return (
            <Card style={{padding:'20px'}}>
                <Grid container spacing={5}>
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
                    <Grid item xs={2}  >
                    {/* <TextField id="keyword" style={{transform:'translateY(10px)'}} label="Enter Keyword" variant="outlined" /> */}
                    </Grid>
                    <Grid item xs={4} align="left">
                        {/* <GridTimeFilter toFromDatesHandlers={[setTo,setFrom]} /> */}
                    </Grid>
                    <Grid item xs={2} align="left">
                    {/* <Button style={{transform:"translateY(10px)"}} className={classes.button} >
                        Search
                    </Button> */}
                    </Grid>
                    <Grid item xs={2}>
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
                    <Grid item xs={12} md={12}>
                        <MaterialTable 
                            title='Export Data'
                            columns={[
                                {title:'Date',field:'date',editable:'never'},
                                {title:'Name',field:'name',editable:'never'},
                                {title:'Screen Name',field:'screenName',editable:'never'},
                                {title:'Tweet',field:'tweet',editable:'never'},
                                {title:'Followers Count',field:'followersCount',editable:'never'},
                                {title:'Retweet Count',field:'retweetCount',editable:'never'},
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
                                    backgroundColor:'rgb(67, 176, 42)',
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
                    {/* <Grid item sm={12} md={4}  >
                    <Grid container spacing={3} style={{position:'sticky',top:'60px'}} >
                        <Grid item xs={12} >
                            <FilterHeader refresh={[refresh,setRefresh]}/>
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters 
                                    sources={[sources,setSources]} 
                                    languages={[languages,setLanguages]} 
                                    subSources={[subSources,setSubSources]}
                                />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid> */}
                </Grid>
            </Card>
    )
}

export default ExportData
