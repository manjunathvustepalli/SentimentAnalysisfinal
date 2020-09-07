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
import InfluencerComparison from '../SummaryDashBoardCharts/InfluencerComparison';
import ChipInputFilter from '../Filters/ChipInputFilter';
import Keywords from '../Filters/Keywords';


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
        <SideNav>    
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px 0px 20px 20px'}}>
                <Typography style={{color:'green',marginBottom:'10px'}} variant='h5' >
                    Summary Dashboard
                </Typography>
                <Grid container spacing={2}>
                    <Grid item md={8} sm={12} xs={12}>
                        <Card>
                            <IconWithText style={{margin:'10px 10px 0 10px'}}>
                                <FilterListIcon /> 
                                <p> FILTERS </p>
                            </IconWithText>
                            <Grid container>    
                                <Grid item xs={12} sm={6} md={3} >
                                <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="keyword-type-label">Keyword Type</InputLabel>
                            <Select
                                labelId="keyword-type-label"
                                id="keyword-type"
                                label="Keyword Type"
                                value={keywordType}
                                onChange={(e) => setKeywordType(e.target.value)}
                            >
                            <MenuItem value='Entire Data'>Entire Data</MenuItem>
                            <MenuItem value='Screen Name'>Screen Name</MenuItem>
                            <MenuItem value='Hash Tags'> Hash Tags </MenuItem>
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
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                        <FilterHeader refresh={[refresh,setRefresh]}/>
                    </Grid>                  
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
                    <Grid item xl={4} md={6} xs={12}>
                        <Card className={classes.main} >
                            <Grid container>
                                <Grid item xs={5} style={{height:'90px',lineHeight:'90px',padding:'10px 0 0 20px'}}>
                                    Geo Tagging Summary
                                </Grid>
                                <Grid item xs={7}>
                                    <InlineFilter sources={['newspaper','twitter']} source={'newspaper'} sentiment={'positive'} mood={'joy'} />
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
