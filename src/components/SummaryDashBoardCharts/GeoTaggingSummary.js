import { Card, Grid, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core'
import React, { useState } from 'react'
import GeoHotSpotMap from '../charts/Maps/GeoHotSpotMap'

const useStyles = makeStyles((theme) => ({
    filterDefault: {
        borderColor: "#43B02A",
        borderStyle: "solid",
        borderWidth: "1px",
        padding: '5px',
        color: "#43B02A",
    },
    filterColorDefault:{
        color: "#43B02A"
    },

}));


function GeoTaggingSummary() {

    const [sources, setSources] = useState(['newspaper','twitter'])
    const [source, setSource] = useState('newspaper')
    const [sentiment, setSentiment] = useState('positive')
    const [mood, setMood] = useState('joy')
    const [type, setType] = useState('sentiment')
    const classes = useStyles();

    return (
        <Card >
            <Grid container>
                <Grid item xs={5} style={{height:'90px',lineHeight:'90px',padding:'10px 0 0 20px'}}>
                    Geo Tagging Summary
                </Grid>
                <Grid item xs={7}>
                { sources && sources.length && (
                    <Grid container spacing={1} style={{marginTop:'20px'}}>
                    <Grid item xs={4} >
                        <InputLabel id="select-source" className={classes.filterColorDefault} >Source</InputLabel>
                            <Select
                            labelId="select-source"
                            id="select-source-main"
                            fullWidth
                            className={classes.filterDefault}
                            value = {source}
                            onChange = { (e) => setSource(e.target.value) }
                            >
                                {
                                   sources && sources.length && (sources.map((source,i) => <MenuItem value={source} key={i} >{source}</MenuItem>))
                                }                    
                            </Select>
                    </Grid>
                    <Grid item xs={4}>
                        <InputLabel id="demo-simple-select-helper-label"className={classes.filterColorDefault} >Type </InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            fullWidth
                            value={type}
                            onChange = {(e) => setType(e.target.value)}
                            className={classes.filterDefault}
                        >
                            <MenuItem value={'sentiment'}>Sentiment</MenuItem>
                            <MenuItem value={'mood'}>Mood</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                    {
                        type ==='sentiment' ? (
                            <>
                            <InputLabel id="demo-simple-select-helper-label"className={classes.filterColorDefault} >Sentiment </InputLabel>
                            <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            fullWidth
                            value={sentiment}
                            onChange = {(e) => setSentiment(e.target.value)}
                            className={classes.filterDefault}
                            >
                            <MenuItem value={'negative'}>Negative</MenuItem>
                            <MenuItem value={'positive'}>Positive</MenuItem>
                            <MenuItem value={'neutral'}>Neutral</MenuItem>
                            </Select>
                            </>
                        ) : (
                            <>
                            <InputLabel id="demo-simple-select-helper-label" className={classes.filterColorDefault}>Mood </InputLabel>
                            <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            fullWidth
                            value = {mood}
                            onChange = {(e) => setMood(e.target.value)}
                            className={classes.filterDefault}
                            >
                            <MenuItem value={'joy'}>Joy</MenuItem>
                            <MenuItem value={'anticipation'}>Anticipation</MenuItem>
                            <MenuItem value={'surprise'}>Surprise</MenuItem>
                            <MenuItem value={'anger'}>Anger</MenuItem>
                            <MenuItem value={'trust'}>Trust</MenuItem>
                            <MenuItem value={'fear'}>Fear</MenuItem>
                            <MenuItem value={'sad'}>Sad</MenuItem>
                            <MenuItem value={'disgust'}>Disgust</MenuItem>
        
                            </Select>
                            </>
                        )
                    }                        
                    </Grid>
                </Grid>
                ) }
            </Grid>
                <Grid item xs={12} align="center">
                    <GeoHotSpotMap />
                </Grid>
            </Grid>
        </Card>
    )
}

export default GeoTaggingSummary
