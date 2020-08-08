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
import Axios from 'axios';
import moment from 'moment'
import FilterHeader from '../Filters/FilterHeader';
import FilterWrapper from '../Filters/FilterWrapper';
import AccordianFilters from '../Filters/AccordianFilters';
import { Button } from '@material-ui/core';
import Table1 from '../Tables/Table1'

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


export default function SentimentalAnalysisPieChart() {
    const [chartType, setChartType] = useState('pie')
    const [showTable, setShowTable] = useState(false)
    const classes = useStyles();
    const handleChange = (e) => {
        console.log(e.target.value)
        setChartType(e.target.value)
    }

    return (
        <SideNav>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px' }}> Sentimental Analysis
            {chartType === 'area' && (<Redirect to='/sentimental-analysis/area-chart' />) }
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item sm={8}>
                                <CardContent>
                                    Source wise Sentiment Wise Distribution of Post
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
                                    <MenuItem value={chartType}>pie chart</MenuItem>
                                    <MenuItem value={'area'}>Area chart</MenuItem>
                            </Select>
                            </FormControl>
                            </Grid>
                            {['Facebook','Twitter','Instagram','Youtube','Other Media'].map((chart,i) =>(
                                <Grid align='center' item key={i} sm={6} xs={12}>
                                    <DonutChart/>
                                    <Button variant='outlined' color='primary'>
                                        {chart}
                                    </Button>
                                </Grid>
                            ))}
                            <Grid item align='right' xs={10} style={{margin:'30px'}}>
                                <Button color='primary' variant='contained' onClick={() => setShowTable(prev => !prev)}>
                                    {showTable ? 'Close' : 'View Source'}
                                </Button>
                            </Grid>
                            <Grid item xs={12} >
                                {showTable && (<Table1/>)}
                            </Grid>
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
                                <AccordianFilters singleDate={true} />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        </SideNav>
    );
}