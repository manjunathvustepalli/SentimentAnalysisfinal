import React,{useState} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Grid } from '@material-ui/core';


function Sources() {

    const [sources, setSources] = useState(['Facebook','Twitter','Instagram','Youtube','Other Media'])

    return (
        <Grid container>
            {sources.map((source,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Switch name="checkedA" />}
                label={source}
              />
                </Grid>
            ))}
        </Grid>
    )
}

export default Sources
