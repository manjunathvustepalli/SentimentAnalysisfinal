import { Card, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core'
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
                <Grid item xs={5} style={{fontSize: 16,fontWeight: "bold",color: "#CB0038",height:'90px',lineHeight:'90px',padding:'10px 0 0 20px'}}>
                    Geo Tagging Summary
                </Grid>
                <Grid item xs={3} />
                <Grid item xs={4}>
                { sources && sources.length && (
                    <Grid container spacing={2} style={{marginTop:'10px'}}>
                    <Grid item xs={4} >
                        <FormControl variant="outlined" style={{width:'100%'}}>
                            <InputLabel id="select-source"  >Source</InputLabel>
                            <Select
                            labelId="select-source"
                            id="select-source-main"
                            variant="outlined"
                            label="Source"
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
