import React,{ useEffect } from 'react'
import { Grid, FormControl, InputLabel, Select, MenuItem, makeStyles } from '@material-ui/core'

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

function InlineFilter(props) {
    const classes = useStyles();

    return (
        <Grid container spacing={1} style={{marginTop:'20px'}}>
            <Grid item xs={4} >
                <InputLabel id="select-source" className={classes.filterColorDefault} >Source</InputLabel>
                    <Select 
                    labelId="select-source"
                    id="select-source-main"
                    fullWidth
                    className={classes.filterDefault}
                    value = {props.source}
                    onChange = { (e) => props.setSource(e.target.value) }
                    >
                        {
                           props.sources && props.sources.length && (props.sources.map((source,i) => <MenuItem value={source} key={i} >{source}</MenuItem>))
                        }                    
                    </Select>
            </Grid>
            <Grid item xs={4}>
                <InputLabel id="demo-simple-select-helper-label"className={classes.filterColorDefault} >Sentiment </InputLabel>
                    <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    fullWidth
                    value={props.sentiment}
                    onChange = {(e) => props.setSentiment(e.target.value)}
                    className={classes.filterDefault}
                    >
                    <MenuItem value={'negative'}>Negative</MenuItem>
                    <MenuItem value={'positive'}>Positive</MenuItem>
                    <MenuItem value={'neutral'}>Neutral</MenuItem>
                        
                    </Select>
            </Grid>
            <Grid item xs={3}>
                <InputLabel id="demo-simple-select-helper-label" className={classes.filterColorDefault}>Mood </InputLabel>
                    <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    fullWidth
                    value = {props.mood}
                    onChange = {(e) => props.setMood(e.target.value)}
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
            </Grid>
        </Grid>
    )
}

export default InlineFilter
