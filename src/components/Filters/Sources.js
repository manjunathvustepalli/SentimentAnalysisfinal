import React,{useState} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Checkbox } from '@material-ui/core';
import { capitalizeString } from '../../helpers'

function Sources(props) {
    const [ sources, setSources ] = props.sources

    const handleSourceChange = (source) => {
      setSources({...sources,[source]:!sources[source]})
    }

    return (
        <Grid container>
            {Object.keys(sources).map((source,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                  control={<Checkbox  name={source}
                  style={{ color: "white" }}
                  checked={sources[source]} onChange={() => handleSourceChange(source)}  />}
                  label={capitalizeString(source)}
                />
                </Grid>
            ))}
        </Grid>
    )
}

export default Sources
