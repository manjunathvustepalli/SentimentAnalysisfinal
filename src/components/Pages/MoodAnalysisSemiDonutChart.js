import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DonutChart from '../charts/DonutChart';
import SideNav from '../Navigation/SideNav'
import { Redirect } from 'react-router-dom';
import FilterHeader from '../Filters/FilterHeader';
import FilterWrapper from '../Filters/FilterWrapper';
import AccordianFilters from '../Filters/AccordianFilters';
import { Button, Typography } from '@material-ui/core';
import Table1 from '../Tables/Table1'
import Axios from 'axios';
import { getKeyArray, getDocCountByKey } from '../../helpers';
import moment from 'moment'
import { moodAnalysisPieChartFilter, sentimentAnalysisPieChartFilter } from '../../helpers/filter';
import SemiDonutChart from '../charts/SemiDonutChart';

const useStyles = makeStyles((theme) => ({
    main: {

        fontSize: 16,
        fontWeight: "bold",
        color: "#CB0038",
    },
    formControl: {
        margin: '20px',
        fullWidth: true,
        display: 'flex',
        wrap: 'nowrap'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    dataDate:{
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginTop:50,
    },
    paper: {
        height: 140,
        width: 130,        
      },
      buttonStyle:{
        border:'1px solid green',
        color:'green',
        '&:hover': {
            border:'1px solid green',
        }
    }
}));
var sortedData = {}
export default function MoodAnalysisSemiDonutChart() {
    const [chartType, setChartType] = useState('semi pie')
    const [showTable, setShowTable] = useState(false)
    const [sources, setSources] = useState([])
    const [refresh, setRefresh] = useState(true)
    const [data, setData] = useState({})
    const [date, setDate] = useState(moment(new Date()).format('DD-MM-YYYY'))
    const [languages,setLanguages] = useState([])
    const [moods, setMoods] = useState([])
    const classes = useStyles();
    const handleChange = (e) => {
        setChartType(e.target.value)
    }

    useEffect(() => {

        Axios.post(process.env.REACT_APP_URL,
        {
         "aggs": {
           "date-based-range": {
             "date_range": {
                "field": "CreatedAt",
                "format": "dd-MM-yyyy HH:mm",
                "ranges": [
                  { "from": `${date} 00:00`, "to": `${date} 23:59` }
               ]
             },
             "aggs": {
               "lang": {
                 "terms": {
                   "field": "predictedLang.keyword"
                 },
                 "aggs": {
                   "Source": {
                     "terms": {
                       "field": "Source.keyword"
                     },
                     "aggs": {
                           "per-day": {
                             "date_histogram": {
                                 "field": "CreatedAt",
                                 "format": "yyyy-MM-dd", 
                                 "calendar_interval": "day"
                             },
                           "aggs": {
                             "Daily-Sentiment-Distro": {
                               "terms": {
                                 "field": "predictedMood.keyword"
                               }
                             }
                           }
                           }
                       }
                       }
                   }
                 }
               }
             }
           }
         },{
             headers:{
                'Content-Type':'application/json'
            }
        })
        .then(fetchedData => {
            var sourceKeys,sourceBuckets,perDayKeys,perDayBuckets
            var uniqueSourceKeys = []
            let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
            var languageKeys = getKeyArray(languageBuckets)
            languageKeys.forEach((key,i) =>{
                sourceBuckets = languageBuckets[i].Source.buckets
                sourceKeys = getKeyArray(sourceBuckets)
                sortedData[key] ={}
                sourceKeys.forEach((source,j) => {
                    if(!uniqueSourceKeys.includes(source)){
                        uniqueSourceKeys.push(source)
                    }
                    sortedData[key][source] ={}
                    perDayBuckets = sourceBuckets[j]['per-day'].buckets
                    sortedData[key][source]['joy'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'joy'))[0]
                    sortedData[key][source]['anticipation'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'anticipation'))[0]
                    sortedData[key][source]['fear'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'fear'))[0]
                    sortedData[key][source]['disgust'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'disgust'))[0]
                    sortedData[key][source]['sad'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'sad'))[0]
                    sortedData[key][source]['surprise'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'surprise'))[0]
                    sortedData[key][source]['trust'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'trust'))[0]
                    sortedData[key][source]['anger'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'anger'))[0]
                });
            })
            let availableSourceKeys = {}
            uniqueSourceKeys.forEach(source => {
                availableSourceKeys[source] = true
            })
            setSources(availableSourceKeys)
            let availableLanguageKeys = {}
            languageKeys.forEach(lang =>{
                availableLanguageKeys[lang] = true
            })
            setLanguages(availableLanguageKeys)
            setMoods(prev => {
                if(Object.keys(prev).length){
                    return prev
                } else {
                    return {'joy':true,'anticipation':true,'fear':true,'disgust':true,'sad':true,'surprise':true,'trust':true,'anger':true}
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }, [date,refresh])

    useEffect(()=>{
        let temp = moodAnalysisPieChartFilter(languages,moods,sources,sortedData) 
        if(temp){
            setData(temp)
        }
    },[moods,languages,sources])

    return (
        <SideNav>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px' }}>
            {chartType === 'area' && (<Redirect to='/mood-analysis/area-chart' />) }
            {chartType === 'line' && <Redirect to='/mood-analysis/line-chart' />}
            {chartType === 'pie' && <Redirect to='/mood-analysis/pie-chart' />}
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px'}}>
                        Mood Analysis
                    </Typography>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item sm={8}>
                                <CardContent>
                                    Source wise Mood Wise Distribution of Post
                                </CardContent>
                            </Grid>
                            <Grid item sm={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Change Chart Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={chartType}
                                onChange={handleChange}
                                label="Change Chart type"
                            >
                                    <MenuItem value={'area'}>Area chart</MenuItem>
                                    <MenuItem value={'line'}>Line chart</MenuItem>
                                    <MenuItem value={'pie'}>Pie chart</MenuItem>
                                    <MenuItem value={chartType}>Semi Pie chart</MenuItem>

                            </Select>
                            </FormControl>
                            </Grid>
                            {Object.keys(data).map((source,i) => {
                                return (<Grid align='center' item key={i} lg={4} md={4} sm={6} xs={12}>
                                <SemiDonutChart data ={data[source]}/>
                                <Button variant='outlined' color='primary'>
                                    {source}
                                </Button>
                            </Grid>)
                            }
                            )}
                            <Grid item align='right' xs={10} style={{margin:'30px'}}>
                                <Button className={classes.buttonStyle} variant="outlined" color="primary" onClick={() => setShowTable(prev => !prev)}>
                                    {showTable ? 'Close' : 'View Source'}
                                </Button>
                            </Grid>
                            <Grid item xs={12} >
                                {showTable && (<Table1/>)}
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item sm={12} md={4} >
                    <Grid container spacing={3} style={{position:'sticky',top:'60px'}}>
                        <Grid item xs={12} >
                        <FilterHeader refresh={[refresh,setRefresh]}/>
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters singleDate={setDate}  sources={[sources, setSources]} languages={[languages,setLanguages]} moods={[moods,setMoods]} />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        </SideNav>
    );
}