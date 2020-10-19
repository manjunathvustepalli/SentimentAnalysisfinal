import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Checkbox, makeStyles } from '@material-ui/core';
import { capitalizeString } from '../../helpers'

function Sources(props) {
    const [ subSources, setSubSources ] = props.sources

    const useStyles = makeStyles({
        root: {
          "&$checked": {
            color: "#43B02A"
          },
        },
        checked: {}
      })

    const classes = useStyles()

    const handleSubSourceChange = (subSource) => {
      setSubSources({...subSources,[subSource]:!subSources[subSource]})
    }

    return (
        <Grid container>
            {Object.keys(subSources).map((subSource,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Checkbox  name={subSource} classes={{
                    root: classes.root,
                    checked: classes.checked
                  }} checked={subSources[subSource]} onChange={() => handleSubSourceChange(subSource)}  />}
                label={capitalizeString(subSource)}
                />
                </Grid>
            ))}
        </Grid>
    )
}

export default Sources
