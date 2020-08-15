import React from 'react'
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

function InlineFilter() {
    return (
        <Grid container style={{marginTop:'20px'}}>
            <Grid item xs={4}>
                                    <InputLabel id="select-source">Source </InputLabel>
                                        <Select
                                        labelId="select-source"
                                        id="demo-simple-select-helper"
                                        fullWidth
                                        >
                                        <MenuItem value={'twitter'} >Twitter</MenuItem>
                                        <MenuItem value={'Instagram'}>Instagram</MenuItem>
                                        <MenuItem value={'Newspaper'}>Newspaper</MenuItem>
                                        <MenuItem value={'Facebook'}>Facebook</MenuItem>
                                        </Select>
            </Grid>
            <Grid item xs={4}>
                                    <InputLabel id="demo-simple-select-helper-label">Sentiment </InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        fullWidth
                                        >
                                        <MenuItem value={'Negative'}>Negative</MenuItem>
                                        <MenuItem value={'Positive'}>Positive</MenuItem>
                                        <MenuItem value={'Neutral'}>Neutral</MenuItem>
                                            
                                        </Select>
            </Grid>
            <Grid item xs={4}>
                                    <InputLabel id="demo-simple-select-helper-label">Mood </InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        fullWidth
                                        >
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
