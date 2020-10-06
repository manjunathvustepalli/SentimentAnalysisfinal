import { Card, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
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

    const [sources] = useState(['newspaper','twitter'])
    const [source, setSource] = useState('newspaper')
    const [sentiment, setSentiment] = useState('positive')
    const [mood, setMood] = useState('joy')
    const [type, setType] = useState('sentiment')
    const classes = useStyles();

    return (
        <Card style={{height:'505px'}}>
            <Grid container>
                <Grid item xs={4} style={{fontSize: 12,fontWeight: "bold",color: "#CB0038",height:'70px',lineHeight:'70px',paddingLeft:'20px'}}>
                    Geo Summary
                </Grid>
                <Grid item xs={8}>
                { sources && sources.length && (
                    <Grid container spacing={1} style={{marginTop:'10px'}}>
                    <Grid item xs={4} >
                        <FormControl variant="outlined" style={{width:'100%'}}>
                            <InputLabel id="select-source"  >Source</InputLabel>
                            <Select
                            labelId="select-source"
                            id="select-source-main"
                            variant="outlined"
                            label="Source"
                            style={{fontSize:'7px',height:'30px'}}
                            fullWidth
                            value = {source}
                            onChange = { (e) => setSource(e.target.value) }
                            >
                                {
                                   sources && sources.length && (sources.map((source,i) => <MenuItem value={source} key={i} >{source}</MenuItem>))
                                }                    
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" style={{width:'100%'}} >
                        <InputLabel id="Select-type" >Type </InputLabel>
                        <Select
                            labelId="Select-type"
                            id="select-type-main"
                            fullWidth
                            label="Type"
                            style={{fontSize:'7px',height:'30px'}}
                            variant="outlined"
                            value={type}
                            onChange = {(e) => setType(e.target.value)}
                        >
                            <MenuItem value={'sentiment'}>Sentiment</MenuItem>
                            <MenuItem value={'mood'}>Mood</MenuItem>
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                    {
                        type ==='sentiment' ? (
                            <FormControl variant="outlined" style={{width:'90%'}} >
                                <InputLabel id="sentiment-select" >Sentiment </InputLabel>
                                <Select
                                    labelId="sentiment-select"
                                    id="sentiment-select-main"
                                    fullWidth
                                    style={{fontSize:'7px',height:'30px'}}
                                    label="Sentiment"
                                    value={sentiment}
                                    onChange = {(e) => setSentiment(e.target.value)}
                                >
                                    <MenuItem value={'negative'}>Negative</MenuItem>
                                    <MenuItem value={'positive'}>Positive</MenuItem>
                                    <MenuItem value={'neutral'}>Neutral</MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <FormControl variant="outlined" style={{width:'90%'}}>
                                <InputLabel id="select-mood" >Mood </InputLabel>
                                <Select
                                    labelId="select-mood"
                                    id="select-mood-main"
                                    fullWidth
                                    label="Mood"
                                    value = {mood}
                                    onChange = {(e) => setMood(e.target.value)}
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
                            </FormControl>
                        )
                    }                        
                    </Grid>
                <Grid item xs={1} />
                </Grid>
                ) }
            </Grid>
            <Link style={{width:'100%'}} to="/geo-hotspot">
                <Grid item xs={12} align="center">
                    <GeoHotSpotMap />
                </Grid>
            </Link>
            </Grid>
        </Card>
    )
}

export default GeoTaggingSummary
