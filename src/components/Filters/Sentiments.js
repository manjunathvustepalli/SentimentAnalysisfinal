import React,{useState} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Checkbox, makeStyles } from '@material-ui/core';


function Sentiments() {

    const [sentiments, setSentiment] = useState(['Positive','Negative','Neutral','All'])
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
            {sentiments.map((sentiment,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Checkbox classes={{
                    root: classes.root,
                    checked: classes.checked
                  }}  name="checkedA" />}
                label={sentiment}
              />
                </Grid>
            ))}
        </Grid>
    )
}

export default Sentiments
