import React, { useState } from 'react'
import SideNav from '../Navigation/SideNav'
import { Typography, Grid, Card, TextField } from '@material-ui/core'
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


const IconWithText = styled.div`
  display: flex;
  align-items:center;
  justify-content:flex-start;
  font-size:15px;
  color:white
`;

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      width:'90%',
      borderBottom:'2px solid white'
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    root: {
        background: "black"
    },
    input: {
        color: "white"
    }
  }));

function SummaryDashBoard() {
    const classes = useStyles();
    const [refresh, setRefresh] = useState(false)
    return (
        <SideNav>    
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px'}}>
                <Typography style={{color:'green'}}>
                    Summary Dashboard
                </Typography>
                <Grid container spacing={2}>
                    <Grid item md={8} sm={12} xs={12}>
                        <Card style={{backgroundColor:'#2C3335'}}>
                            <IconWithText>
                                <FilterListIcon style={{margin:'0 20px'}} /> 
                                <p> FILTERS </p>
                            </IconWithText>
                            <Grid container>    
                                <Grid item xs={12} sm={6} md={3} >
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-helper-label" style={{color:"white"}}>Select keyword type</InputLabel>
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
                                            labelId='type keyword'
                                            variant="standard"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} >
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-helper-label" sty>Select keyword type</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} >
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-helper-label">Select keyword type</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                        <FilterHeader refresh={[refresh,setRefresh]}/>
                    </Grid>                  
                    <Grid item md={4} sm={12} xs={12}>

                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                        <Card>
                        <TrendAnalysisLineChart />
                        </Card>
                    </Grid>                    
                    <Grid item md={4} sm={12} xs={12}>
                        <Card>
                        <MoodAreaChart />
                        </Card>
                    </Grid>                   
                    <Grid item md={4} sm={12} xs={12}>
                        <TreeMap/>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
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
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>

                    </Grid>
                </Grid>
            </div>
        </SideNav>
    )
}

export default SummaryDashBoard
