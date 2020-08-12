import React, { useState } from 'react'
import SideNav from '../Navigation/SideNav'
import { Grid, Typography, Card, CardContent, FormControl, InputLabel, MenuItem, Select,makeStyles } from '@material-ui/core'
import FilterWrapper from '../Filters/FilterWrapper'
import AccordianFilters from '../Filters/AccordianFilters'
import FilterHeader from '../Filters/FilterHeader'
import Table2 from '../Tables/Table2'
import TreeMap from '../charts/TreeMap'
import { addMonths } from '../../helpers'


function InfluencerAnalysis() {
    const [refresh, setRefresh] = useState(true)
    const [sources,setSources] = useState([])
    const [languages,setLanguages] = useState([])
    const [from, setFrom] = useState(addMonths(new Date(),-1))
    const [to, setTo] = useState(addMonths(new Date(),0))
    const [moods, setMoods] = useState({})
    const [sentiments, setSentiments] = useState({})


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

    const classes = useStyles()

    return (
        <SideNav>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px', }}>
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px'}}>
                        Influencer Analysis
                    </Typography>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item md={7} sm={5}>
                                <CardContent>
                                    Top Influencers
                                </CardContent>
                            </Grid>
                            <Grid item md={5} sm={7}>
                            <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="select-table">Select Table Type</InputLabel>
                            <Select
                                labelId="select-table"
                                id="demo-simple-select-outlined"
                                varient={'standard'}
                            >
                                <MenuItem selected value='top 15 influencers'>Top 15 Influencers</MenuItem>
                                <MenuItem value='top 30 influencers'>Top 30 influencers</MenuItem>
                            </Select>
                            </FormControl>
                            </Grid>
                        <Grid item xs={12}>
                            <Table2 />
                        </Grid>
                        <Grid item xs={11}>
                            <TreeMap />
                        </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item sm={12} md={4}  >
                    <Grid container spacing={3} >
                        <Grid item xs={12} >
                            <FilterHeader refresh={[refresh,setRefresh]} />
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                            <AccordianFilters 
                                    toFromDatesHandlers={[setFrom,setTo,addMonths]} 
                                    sources={[sources,setSources]} 
                                    languages={[languages,setLanguages]} 
                                    moods={[moods,setMoods]} 
                                    sentiments={[sentiments,setSentiments]}
                                />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        </SideNav>
      )
}

export default InfluencerAnalysis
