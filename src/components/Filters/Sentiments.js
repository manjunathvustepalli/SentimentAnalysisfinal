import React,{useState} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Grid } from '@material-ui/core';


function Sentiments() {

    const [sentiments, setSentiment] = useState(['Positive','Negative','Neutral','All'])

    return (
        <Grid container>
            {sentiments.map((sentiment,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Switch name="checkedA" />}
                label={sentiment}
              />
                </Grid>
            ))}
        </Grid>
    )
}

export default Sentiments
