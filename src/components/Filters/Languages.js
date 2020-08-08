import React,{useState} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Grid } from '@material-ui/core';


function Languages() {

    const [languages, setLanguages] = useState(['English','Bangla','All'])

    return (
        <Grid container>
            {languages.map((language,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Switch name="checkedA" />}
                label={language}
              />
                </Grid>
            ))}
        </Grid>
    )
}

export default Languages
