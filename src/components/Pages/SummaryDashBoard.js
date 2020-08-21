import React, { useState } from 'react'
import SideNav from '../Navigation/SideNav'
import { Typography, Grid, Card, TextField, CardContent } from '@material-ui/core'
import FilterHeader from '../Filters/FilterHeader'
import styled from 'styled-components';
import FilterListIcon from '@material-ui/icons/FilterList';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import MoodAreaChart from '../charts/MoodAreaChart';
import TrendAnalysisLineChart from "../charts/TrendAnalysisLineChart";
import WordCloud from "../charts/WordCloudChart";
import TreeMap from "../charts/TreeMap";
import { addMonths } from '../../helpers';
import DateFilter from '../Filters/DateFilter';
import GridTimeFilter from '../Filters/GridTimeFilter';
import DonutChart from '../charts/DonutChart';
import InlineFilter from '../Filters/InlineFilter';


const IconWithText = styled.div`
  display: flex;
  align-items:center;
  justify-content:flex-start;
  font-size:15px;
  color:black
`;

const useStyles = makeStyles((theme) => ({
    main: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#CB0038",
    },
    formControl: {
      margin: theme.spacing(1),
      width:'90%',
      borderBottom:'2px solid white'
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    gridposition: {
        position: "relative",
    }
  }));

function SummaryDashBoard() {
    const classes = useStyles();
    const [refresh, setRefresh] = useState(false)
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))

    return (
        <SideNav>    
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px'}}>
                <Typography style={{color:'green'}} variant='h5' >
                    Summary Dashboard
                </Typography>
                <Grid container spacing={2}>
                    <Grid item md={8} sm={12} xs={12}>
                        <Card>
                            <IconWithText>
                                <FilterListIcon style={{margin:'0 20px'}} /> 
                                <p> FILTERS </p>
                            </IconWithText>
                            <Grid container>    
                                <Grid item xs={12} sm={6} md={3} >
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-helper-label">Select keyword type</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} >
                                <FormControl className={classes.formControl}>
                                        <TextField
                                            label='type keyword'
                                            variant="standard"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} >
                                    <GridTimeFilter toFromDatesHandlers={[setFrom,setTo]} />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                        <FilterHeader refresh={[refresh,setRefresh]}/>
                    </Grid>                  
                    <Grid item xl={4} md={6} xs={12}>
                        <Card className={classes.main}>
                            <CardContent >Overall Analysis</CardContent>
                            <Grid container spacing={0} className={classes.gridposition}>
                                <Grid item xs={6}>
                                    <DonutChart mood={false} data={[['negative',16],['positive',11],['check',30]]} />
                                </Grid>
                                <Grid item xs={6}>
                                    <DonutChart mood={true} />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid item xl={4} md={6} sm={12} xs={12}>
                        <Card>
                        <TrendAnalysisLineChart dates={['15-08-2020','16-08-2020','17-08-2020','18-08-2020']} data={[{name:"happy",data:[20,30,20,10,34,34]},{name:"sad",data:[10,10,30,20,40,4]},{name:"anticipation",data:[0,0,40,20,4,24]},{name:"happy",data:[2,31,30,90,32,34]}]} />
                        </Card>
                    </Grid>                    
                    <Grid item xl={4} md={6} xs={12}>
                        <Card className={classes.main} >
                            <CardContent>Sentiment Analysis</CardContent>
                            <MoodAreaChart />
                        </Card>
                    </Grid>                   
                    <Grid item xl={4} md={6} xs={12}>
                        <Card className={classes.main} >
                            <Grid container>
                                <Grid item xs={5}>
                                    <CardContent>Influence Comparison</CardContent>
                                </Grid>
                                <Grid item xs={7}>
                                    <InlineFilter />
                                </Grid>
                            </Grid>
                            <TreeMap/>
                        </Card>
                    </Grid>
                    <Grid item xl={4} md={6} xs={12}>
                        <Card className={classes.main} >
                            <Grid container>
                                <Grid item xs={5}>
                                    <CardContent>Word Cloud</CardContent>
                                </Grid>
                                <Grid item xs={7}>
                                    <InlineFilter />
                                </Grid>
                            </Grid>
                           <WordCloud data={[{
                                name:'Covid-19',
                                weight:99,
                                color:'rgba(255,0,0,0.5)'
                            },{
                                name:'China',
                                weight:54,
                                color:'rgba(255,0,0,0.5)'
                            },{
                                name:'Sheikh Hasina',
                                weight:45,
                                color:'rgb(0,255,0,0.5)'
                            },{
                                name:'karthik',
                                weight:45,
                                color:'rgb(56,255,12,0.5)'
                            },{
                                name:'কোভিড 19',
                                weight:99,
                                color:'rgba(255,0,0,0.5)'
                            },{
                                name:'চীন',
                                weight:54,
                                color:'rgba(255,0,0,0.5)'
                            },{
                                name:'শেখ হাসিনা',
                                weight:45,
                                color:'rgb(0,255,0,0.5)'
                            }]} />
                        </Card>
                    </Grid>
                    <Grid item xl={4} md={6} xs={12}>
                        <Card className={classes.main} >
                            <Grid container>
                                <Grid item xs={5}>
                                    <CardContent>Geo Tagging Summary</CardContent>
                                </Grid>
                                <Grid item xs={7}>
                                    <InlineFilter />
                                </Grid>
                                <Grid item xs={12} align="center">
                                <img src={require('../../imgs/bangladesh.svg')} alt="bangladesh" width="71%" />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </SideNav>
    )
}

export default SummaryDashBoard
