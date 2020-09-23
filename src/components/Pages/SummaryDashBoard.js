import React, { useState } from 'react'
import { Typography, Grid, Card, CardContent } from '@material-ui/core'
import FilterHeader from '../Filters/FilterHeader'
import styled from 'styled-components';
import FilterListIcon from '@material-ui/icons/FilterList';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { addMonths } from '../../helpers';
import GridTimeFilter from '../Filters/GridTimeFilter';
import MoodAnalysis from '../SummaryDashBoardCharts/MoodAnalysis';
import SentimentAnalysis from '../SummaryDashBoardCharts/SentimentAnalysis';
import WordCloud from '../SummaryDashBoardCharts/WordCloud'
import OverallAnalysis from '../SummaryDashBoardCharts/OverallAnalysis';
import InfluencerComparison from '../SummaryDashBoardCharts/InfluencerComparison';
import ChipInputFilter from '../Filters/ChipInputFilter';
import GeoTaggingSummary from '../SummaryDashBoardCharts/GeoTaggingSummary';

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
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    formControl: {
        margin: '10px',
        fullWidth: true,
        display: 'flex',
        wrap: 'nowrap'
    },
    gridposition: {
        position: "relative",
    }
  }));

function SummaryDashBoard() {
    const classes = useStyles();
    const [refresh, setRefresh] = useState(false)
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [keywordType, setKeywordType] = useState('Entire Data')
    const [keywords, setKeywords] = useState([])
    const [to, setTo] = useState(addMonths(new Date(),0))

    return (
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px'}}>
                <Typography style={{color:'#43B02A',fontSize:'30px',marginBottom:'10px'}} variant='h5' >
                    Summary Dashboard
                </Typography>
                <Grid container spacing={2}>
                    <Grid item md={8} sm={12} xs={12}>
                        <div className={'keyword-wrapper'}>
                        <Card style={{backgroundColor:'#2C3335',height:'130px'}} >
                            <IconWithText style={{margin:'15px'}}>
                                <FilterListIcon style={{color:'white'}} /> 
                                <p style={{color:'white'}} > FILTERS </p>
                            </IconWithText>
                            <Grid container>    
                                <Grid item xs={12} sm={6} md={3} >
                                <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="keyword-type-label"style={{color:'white'}} >Keyword Type</InputLabel>
                            <Select
                                labelId="keyword-type-label"
                                id="keyword-type"
                                label="Keyword Type"
                                value={keywordType}
                                style={{color:'white'}}
                                onChange={(e) => setKeywordType(e.target.value)}
                            >
                            <MenuItem style={{backgroundColor:'#2C3335',color:'white'}} value='Entire Data'>Entire Data</MenuItem>
                            <MenuItem style={{backgroundColor:'#2C3335',color:'white'}} value='Screen Name'>Screen Name</MenuItem>
                            <MenuItem style={{backgroundColor:'#2C3335',color:'white'}} value='Hash Tags'> Hash Tags </MenuItem>
                            </Select>
                            </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} >
                                    <ChipInputFilter transform={true} setKeywords={setKeywords} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} >
                                    <GridTimeFilter toFromDatesHandlers={[setFrom,setTo]} />
                                </Grid>
                            </Grid>
                        </Card>
                        </div>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                            <FilterHeader refresh={[refresh,setRefresh]}/>
                        </Grid>
                        <Grid item xs={12} >
                        <div id="summary-dashboard" style={{width:'100%'}}>
                        <Grid container spacing={2}>                     
                            <Grid item xl={4} md={12} xs={12}>
                                <OverallAnalysis to={to} from={from}  keywords={keywords} keywordType={keywordType} />
                            </Grid>
                            <Grid item xl={4} md={6} sm={12} xs={12}>
                                <Card className={classes.main} >
                                    <CardContent>Mood Analysis</CardContent> 
                                    <MoodAnalysis keywordType={keywordType} keywords={keywords} toFromDateHandlers={[from,to]} />
                                </Card>
                            </Grid>                    
                            <Grid item xl={4} md={6} xs={12}>
                                <Card className={classes.main} >
                                    <CardContent>Sentiment Analysis</CardContent>
                                    <SentimentAnalysis keywords={keywords} keywordType={keywordType}  toFromDateHandlers={[from,to]} />
                                </Card>
                            </Grid>                   
                            <Grid item xl={4} md={6} xs={12}>
                                <InfluencerComparison from={from} to={to} />
                            </Grid>
                            <Grid item xl={4} md={6} xs={12}>
                                <Card className={classes.main} >
                                   <WordCloud to={to} from={from} keywords={keywords} keywordType={keywordType} />
                                </Card>
                            </Grid>
                            <Grid item xl={4} md={12} xs={12}>
                                <GeoTaggingSummary/>
                            </Grid>
                        </Grid>
                        </div>
                    </Grid>
                </Grid>
            </div>
    )
}

export default SummaryDashBoard
