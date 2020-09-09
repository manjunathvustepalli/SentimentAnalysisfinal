import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import SideNav from '../Navigation/SideNav'
import { Redirect } from 'react-router-dom';
import FilterHeader from '../Filters/FilterHeader';
import FilterWrapper from '../Filters/FilterWrapper';
import AccordianFilters from '../Filters/AccordianFilters';
import { Typography, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import WordCloud from '../charts/WordCloudChart';
import {addMonths} from '../../helpers'

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  const allData = [{
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
}]

    const bengaliData = [{
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
    }]

    let englishData = [{
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
        name:'Sheikh Hasina',
        weight:45,
        color:'rgb(0,255,98,0.5)'
    },{
        name:'Sheikh Hasina',
        weight:45,
        color:'rgb(23,255,0,0.5)'
    },{
        name:'Sheikh Hasina',
        weight:45,
        color:'rgb(45,23,12,0.5)'
    }]



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
      },
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

export default function MoodAnalysisPieChart() {
    const [chartType, setChartType] = useState('pie')
    const [sentiments, setSentiments] = useState({negative:true,positive:true,neutral:true})
    const [moods, setMoods] = useState({'joy':true,'anticipation':true,'fear':true,'disgust':true,'sad':true,'surprise':true,'trust':true,'anger':true})
    const [sources, setSources] = useState({'Twitter':true,'Youtube':false,'Facebook':true,'Instagram':false})
    const [languages, setLanguages] = useState({'English':true,'Bengali':false})
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const [value, setValue] = useState(0);
    const [refresh, setRefresh] = useState(true)

    const classes = useStyles();
    const handleChange = (e) => {
        setChartType(e.target.value)
    }

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
      };

    return (
        <SideNav>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px 0px 20px 20px' }}>
            {chartType === 'area' && (<Redirect to='/mood-analysis/area-chart' />) }
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px'}}>
                        Word Cloud
                    </Typography>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} align='right'>
                                <Button
                                    variant="contained"
                                >
                                    Mood
                                </Button>
                                <Button
                                    variant="contained"
                                >
                                    Sentiment                                   
                                </Button>
                            </Grid>
                            <Grid item sm={4} xs={false}>
                            </Grid>
                            <Grid item sm={8} xs={12}>
                            <AppBar position="static" color="default">
                                <Tabs
                                value={value}
                                onChange={handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                                >
                                    <Tab label="All" {...a11yProps(0)} />
                                    <Tab label="English" {...a11yProps(1)} />
                                    <Tab label="Bengali" {...a11yProps(2)} />
                                </Tabs>
                            </AppBar>
                            </Grid>
                            <Grid item xs={12}>
                            <TabPanel value={value} index={0}>
                                <WordCloud data={allData} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <WordCloud data={englishData} />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <WordCloud data={bengaliData} />
                            </TabPanel>
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
                                <AccordianFilters  toFromDatesHandlers={[setFrom,setTo]} sources={[sources, setSources]} moods={[moods,setMoods]} languages={[languages,setLanguages]} sentiments={[sentiments,setSentiments]} />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        </SideNav>
    );
}