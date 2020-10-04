import React, { useEffect, useState } from 'react'
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
import Loader from '../LoaderWithBackDrop';


const IconWithText = styled.div`
  display: flex;
  align-items:center;
  justify-content:flex-start;
  font-size:15px;
  color:black
`;

const useStyles = makeStyles((theme) => ({
    main: {
        fontSize: 12,
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
    const [open, setOpen] = useState(true)

    useEffect(() => {
        setOpen(true)
        const timer = setTimeout(() => {
            setOpen(false)
        }, 1000);
        return () => clearTimeout(timer)
    }, [refresh])

    return (
            <div style={{ backgroundColor: '#F7F7F7', padding:'10px 20px',position:'relative'}}>
                <Loader open={open} style={{position:'absolute'}} />
                <Typography style={{color:'#43B02A',marginBottom:'5px'}} variant='h4' >
                    Summary Dashboard
                </Typography>
                <Grid container spacing={2}>
                    <Grid item md={8} sm={12} xs={12}>
                        <div className={'keyword-wrapper'}>
                        <Card style={{backgroundColor:'#2C3335',minHeight:'120px'}} >
                            <IconWithText style={{margin:'10px'}}>
                                <FilterListIcon style={{color:'white',marginRight:'10px'}} /> 
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
                            <FilterHeader height={120} refresh={[refresh,setRefresh]}/>
                        </Grid>
                        <Grid item xs={12} >
                        <div id="summary-dashboard" style={{width:'100%'}}>
                        <Grid container spacing={2}>                     
                            <Grid item xl={4} md={4} xs={12} >
                                <OverallAnalysis to={to} from={from} refresh={refresh}  keywords={keywords} keywordType={keywordType} />
                            </Grid>
                            <Grid item xl={4} md={4} sm={12} xs={12}>
                                <Card className={classes.main} >
                                    <CardContent>Mood Analysis</CardContent> 
                                    <MoodAnalysis keywordType={keywordType} keywords={keywords} refresh={refresh} toFromDateHandlers={[from,to]} />
                                </Card>
                            </Grid>                    
                            <Grid item xl={4} md={4} xs={12}>
                                <Card className={classes.main} >
                                    <CardContent>Sentiment Analysis</CardContent>
                                    <SentimentAnalysis keywords={keywords} keywordType={keywordType}  toFromDateHandlers={[from,to]} refresh={refresh} />
                                </Card>
                            </Grid>                   
                            <Grid item xl={4} md={4} xs={12}>
                                <InfluencerComparison from={from} to={to} refresh={refresh} />
                            </Grid>
                            <Grid item xl={4} md={4} xs={12}>
                                <Card className={classes.main} >
                                   <WordCloud to={to} from={from} keywords={keywords} keywordType={keywordType} refresh={refresh} />
                                </Card>
                            </Grid>
                            <Grid item xl={4} md={4} xs={12}>
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
