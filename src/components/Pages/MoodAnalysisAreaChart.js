import React, { useState } from 'react'
import SideNav from '../Navigation/SideNav'
import { Grid, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem, makeStyles } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import MoodAreachart from '../charts/MoodAreaChart'
import FilterHeader from '../Filters/FilterHeader'
import FilterWrapper from '../Filters/FilterWrapper'
import AccordianFilters from '../Filters/AccordianFilters'
import moment from 'moment'


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


function MoodAnalysisAreaChart() {

    const classes = useStyles()
    const [chartType, setChartType] = useState('area')
    const [sources,setSources] = useState([])
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
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

    return (
        <SideNav>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px', }}>
            {chartType === 'pie' && <Redirect to='/mood-analysis/pie-chart' />}
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px'}}>
                        Sentimental Analysis
                    </Typography>
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
                                label="Chart Type"
                            >
                                    <MenuItem value='pie'>pie chart</MenuItem>
                                    <MenuItem value='area'>Area chart</MenuItem>
                            </Select>
                            </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <MoodAreachart />
                        </Grid>
                    </Card>
                </Grid>
                <Grid item sm={12} md={4}  >
                    <Grid container spacing={3} >
                        <Grid item xs={12} >
                            <FilterHeader/>
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters toFromDatesHandlers={[setFrom,setTo,addMonths]} sources={[sources,setSources]} moods={true} />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>       
        </SideNav>
    )
}

export default MoodAnalysisAreaChart
