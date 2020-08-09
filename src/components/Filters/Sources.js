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

    return (
        <Grid container>
            {sources[0] && (sources.map((source,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Checkbox  name="checkedA" classes={{
                    root: classes.root,
                    checked: classes.checked
                  }} checked={Object.values(source)[0]}  />}
                label={capitalizeString(Object.keys(source)[0])}
                />
                </Grid>
            )))}
        </Grid>
    )
}

export default Sources
