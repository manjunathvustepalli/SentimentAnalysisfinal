import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AreaChart from '../charts/AreaChart';
import SideNav from '../Navigation/SideNav'
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import moment from 'moment'
import FilterHeader from '../Filters/FilterHeader';
import FilterWrapper from '../Filters/FilterWrapper';
import AccordianFilters from '../Filters/AccordianFilters';


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
}));


export default function SentimentalAnalysisAreaChart() {
    const [chartType, setChartType] = useState('area')
    const [data, setData] = useState([])
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const classes = useStyles();
    const handleChange = (e) => {
        console.log(e.target.value)
        setChartType(e.target.value)
    }
    function addMonths(date, months) {
        var d = date.getDate();
        date.setMonth(date.getMonth() + months);
        if (date.getDate() !== d) {
          date.setDate(0);
        }
        return moment(date).format('DD-MM-YYYY');
    }

    useEffect(() => {
       Axios.post('http://3.7.187.244:9200/analyzed-docs/_search?size=0',{
        "aggs": {
          "date-based-range": {
            "date_range": {
              "field": "CreatedAt",
              "format": "dd-MM-yyyy",
              "ranges": [
                { "from": from, "to": to }
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
    }, [from,to])

    const fetchXaxiesData = (data) =>{
        let source = data.aggregations['date-based-range'].buckets[0].sources.buckets[0].key
        let bucket = data.aggregations['date-based-range'].buckets[0].sources.buckets[0]['per-day'].buckets
        console.log(bucket,source)
        let XaxiesData = bucket.map(obj => obj.key_as_string)
        let negativeData =  bucket.map(obj => obj['Daily-Sentiment-Distro'].buckets[0].doc_count)
        let neutralData =  bucket.map(obj => obj['Daily-Sentiment-Distro'].buckets[1].doc_count)
        let positiveData =  bucket.map(obj => obj['Daily-Sentiment-Distro'].buckets[2].doc_count)
        setData([XaxiesData,negativeData,neutralData,positiveData,source])
    }

    return (
        <SideNav>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px' }}> Sentimental Analysis
            {chartType === 'pie' && <Redirect to='/sentimental-analysis/pie-chart' />}
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
                            <InputLabel id="demo-simple-select-outlined-label">Change Chart Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={chartType}
                                onChange={handleChange}
                                label="Chart type"
                            >
                                    <MenuItem value='pie'>pie chart</MenuItem>
                                    <MenuItem value='area'>Area chart</MenuItem>
                            </Select>
                            </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <AreaChart data={data} />
                        </Grid>
                    </Card>
                </Grid>
                <Grid item sm={12} md={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <FilterHeader/>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters toFromDatesHandlers={[to,from,setFrom,setTo,addMonths]} />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        </SideNav>
    );
}