import React from 'react'
import { Grid, FormControl, InputLabel, Select, MenuItem, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    filterDefault: {
        borderColor: "#43B02A",
        borderStyle: "solid",
        borderWidth: "1px",
        padding: '5px',
        color: "#43B02A"
    },
    filterColorDefault:{
        color: "#43B02A"
    },

}));

function InlineFilter() {

    const classes = useStyles();

    return (
        <Grid container spacing={1} style={{marginTop:'20px'}}>
            <Grid item xs={4} >
                <InputLabel id="select-source" className={classes.filterColorDefault} >Source</InputLabel>
                    <Select 
                    labelId="select-source"
                    id="demo-simple-select-helper"
                    fullWidth
                    className={classes.filterDefault}
                    defaultValue={'all'}
                    >
                    <MenuItem value={'all'} >All</MenuItem>
                    <MenuItem value={'twitter'} >Twitter</MenuItem>
                    <MenuItem value={'Instagram'}>Instagram</MenuItem>
                    <MenuItem value={'Newspaper'}>Newspaper</MenuItem>
                    <MenuItem value={'Facebook'}>Facebook</MenuItem>
                    </Select>
            </Grid>
            <Grid item xs={4}>
                <InputLabel id="demo-simple-select-helper-label"className={classes.filterColorDefault} >Sentiment </InputLabel>
                    <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    fullWidth
                    className={classes.filterDefault}
                    defaultValue={'all'}
                    >
                    <MenuItem value={'all'} >All</MenuItem>
                    <MenuItem value={'Negative'}>Negative</MenuItem>
                    <MenuItem value={'Positive'}>Positive</MenuItem>
                    <MenuItem value={'Neutral'}>Neutral</MenuItem>
                        
                    </Select>
            </Grid>
            <Grid item xs={4}>
                <InputLabel id="demo-simple-select-helper-label" className={classes.filterColorDefault}>Mood </InputLabel>
                    <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    fullWidth
                    className={classes.filterDefault}
                    defaultValue={'all'}
                    >
                    <MenuItem value={'all'} selected >All</MenuItem>
                    <MenuItem >Joy</MenuItem>
                    <MenuItem >Sad</MenuItem>
                    <MenuItem >Anticipation</MenuItem>
                    <MenuItem >Anger</MenuItem>
                    </Select>
            </Grid>
        </Grid>
    )
}

export default InlineFilter
