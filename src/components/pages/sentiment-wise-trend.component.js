import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import './sentimental.scss'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AreaChart from './chart/AreaChart';
import SideNav from '../navigation/sidebar'
import { Redirect } from 'react-router-dom';
import Filter from '../Filter';
import Axios from 'axios';


const useStyles = makeStyles((theme) => ({
    main: {

        fontSize: 16,
        fontWeight: "bold",
        color: "#CB0038",
    },
    filter: {
        color: "green",
    },
    formControl:{
        marginTop:'20px'
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
}));


export default function SentimentalAnalysis2() {
    const [chartType, setChartType] = useState('pie chart')
    const [redirect, setRedirect] = useState(false)
    const [data, setData] = useState([])
    const classes = useStyles();
    const handleChange = (e) => {
        console.log(e.target.value)
        setChartType(e.target.value)
        if(e.target.value === 'pie chart'){
            setRedirect(true)
        }
    }

    useEffect(() => {
       Axios.post('http://3.7.187.244:9200/analyzed-docs/_search?size=0',{
        "aggs": {
          "date-based-range": {
            "date_range": {
              "field": "CreatedAt",
              "format": "dd-MM-yyyy",
              "ranges": [
                { "from": "01-08-2020", "to": "now" }
              ]
            },
            "aggs": {
              "sources": {
                "terms": {
                  "field": "Source.keyword"},
                  "aggs": {
                      "per-day": {
                        "date_histogram": {
                            "field": "CreatedAt",
                            "format": "dd-MM-yyyy",
                            "calendar_interval": "day"
                        },
                      "aggs": {
                        "Daily-Sentiment-Distro": {
                          "terms": {
                            "field": "predictedSentiment.keyword"
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
    .then((fetchedData)=>{
        console.log(fetchedData.data)
        fetchXaxiesData(fetchedData.data)
    })
    .catch(err => {
        console.log(err)
    })
    }, [])

    const fetchXaxiesData = (data) =>{
        let source = data.aggregations['date-based-range'].buckets[0].sources.buckets[0].key
        let bucket = data.aggregations['date-based-range'].buckets[0].sources.buckets[0]['per-day'].buckets
        console.log(bucket,source)
        let XaxiesData = bucket.map(obj => obj.key_as_string)
        let negativeData =  bucket.map(obj => obj['Daily-Sentiment-Distro'].buckets[0].doc_count)
        let neutralData =  bucket.map(obj => obj['Daily-Sentiment-Distro'].buckets[1].doc_count)
        let positiveData =  bucket.map(obj => obj['Daily-Sentiment-Distro'].buckets[2].doc_count)
        setData([XaxiesData,negativeData,neutralData,positiveData])
    }

    return (
        <SideNav>
            {redirect && (<Redirect to={'/sentimentalanalysis/piechart'} />)}
            <div style={{ color: "green", fontSize: 20, backgroundColor: '#F7F7F7' }}> Sentimental Analysis
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item sm={8}>
                                <CardContent>
                                    Sentiment Wise Trend
                                </CardContent>
                            </Grid>
                            <Grid item sm={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={chartType}
                                onChange={handleChange}
                                label="Chart type"
                            >
                                    <MenuItem value="">
                                    <em>None</em>
                                    </MenuItem>
                                    <MenuItem value='pie chart'>pie chart</MenuItem>
                                    <MenuItem value='Area chart'>Area chart</MenuItem>
                                </Select>
                            </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <AreaChart data={data} />
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.filter}>
                        <CardContent>
                            <Filter/>
                    </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
        </SideNav>
    );
}