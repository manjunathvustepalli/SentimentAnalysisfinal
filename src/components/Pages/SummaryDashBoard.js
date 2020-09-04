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
import TreeMap from "../charts/TreeMap";
import { addMonths } from '../../helpers';
import GridTimeFilter from '../Filters/GridTimeFilter';
import InlineFilter from '../Filters/InlineFilter';
import MoodAnalysis from '../SummaryDashBoardCharts/MoodAnalysis';
import SentimentAnalysis from '../SummaryDashBoardCharts/SentimentAnalysis';
import WordCloud from '../SummaryDashBoardCharts/WordCloud'
import GeoHotSpotMap from '../charts/Maps/GeoHotSpotMap';
import OverallAnalysis from '../SummaryDashBoardCharts/OverallAnalysis';


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
                                    <InputLabel id="demo-simple-select-helper-label">Keyword type</InputLabel>
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
                    <Grid item xl={4} md={12} xs={12}>
                        <OverallAnalysis to={to} from={from}/>
                    </Grid>
                    <Grid item xl={4} md={6} sm={12} xs={12}>
                        <Card className={classes.main} >
                            <CardContent>Mood Analysis</CardContent> 
                            <MoodAnalysis dates={[from,to]} />
                        </Card>
                    </Grid>                    
                    <Grid item xl={4} md={6} xs={12}>
                        <Card className={classes.main} >
                            <CardContent>Sentiment Analysis</CardContent>
                            <SentimentAnalysis  dates={[from,to]} />
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
                           <WordCloud to={to} from={from} />
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
                                    <GeoHotSpotMap />
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
