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
                <InputLabel id="select-type">Keyword</InputLabel>
                <Select
                    labelId="select-type-label"
                    id="select-outlined"
                    label="KeyWord"
                    className={classes.select}
                    >
                    <MenuItem value={'type1'}>Type 1</MenuItem>
                    <MenuItem value={'type2'}>Type 1</MenuItem>
                    <MenuItem value={'type3'}>Type 1</MenuItem>
                    </Select>
            </FormControl>

                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField id="outlined-basic" label="Enter Your Keyword" variant="outlined" />
                </FormControl>
        </div>
    )
}

export default Keywords
