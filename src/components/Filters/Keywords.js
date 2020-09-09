import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';
import ChipInputFilter from './ChipInputFilter';

function Keywords(props) {
    let keywordTypes = ['Entire Data','Screen Name','Hash Tags']

    const [keywordType, setKeywordType] = props.keywordTypes

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
                    value={keywordType}
                    onChange={(e) => setKeywordType(e.target.value)}
                    >
                        {
                            keywordTypes.map(keywordType => <MenuItem value={keywordType}>{keywordType}</MenuItem> )
                        }                    
                    </Select>
            </FormControl>

                <ChipInputFilter setKeywords={props.setKeywords} keywords={props.keywords} />
        </div>
    )
}

export default Keywords
