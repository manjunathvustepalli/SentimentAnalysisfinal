import React,{useState} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Checkbox, makeStyles } from '@material-ui/core';
import { capitalizeString } from '../../helpers'

function Sources(props) {
    const [ sources, setSources ] = props.sources

    const useStyles = makeStyles({
        root: {
          "&$checked": {
            color: "#43B02A"
          },
        },
        checked: {}
      })

    const classes = useStyles()

    const handleSourceChange = (source) => {
      setSources({...sources,[source]:!sources[source]})
    }

    return (
        <Grid container>
            {Object.keys(sources).map((source,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Checkbox  name={source} classes={{
                    root: classes.root,
                    checked: classes.checked
                  }} checked={sources[source]} onChange={() => handleSourceChange(source)}  />}
                label={capitalizeString(source)}
                />
                </Grid>
            ))}
        </Grid>
    )
}

export default Sources
