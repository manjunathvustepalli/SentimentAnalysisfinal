import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';

function Keywords() {

    const useStyles = makeStyles((theme) => ({
        formControl: {
            marginBottom: '20px',
            fullWidth: true,
            display: 'flex',
            wrap: 'nowrap'
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
        select:{
            width:'100%'
        }
    }));

    const classes = useStyles();

    return (
        <div style={{width:'100%'}}>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Keyword</InputLabel>
                <Select
                    labelId="keyword-select-outlined-label"
                    id="select-outlined"
                    label="KeyWord"
                    className={classes.select}
                    >
                <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Type 1</MenuItem>
                    <MenuItem value={20}>Type 1</MenuItem>
                    <MenuItem value={30}>Type 1</MenuItem>
                    </Select>
            </FormControl>

                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField id="outlined-basic" label="Enter Your Keyword" variant="outlined" />
                </FormControl>
        </div>
    )
}

export default Keywords
