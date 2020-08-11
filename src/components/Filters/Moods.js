import React,{useState} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Checkbox, makeStyles } from '@material-ui/core';
import { capitalizeString } from '../../helpers';


function Sentiments(props) {

    const [moods, setMoods] = props.moods 
    const useStyles = makeStyles({
        root: {
          "&$checked": {
            color: "#43B02A"
          },
        },
        checked: {}
      })

    const classes = useStyles()

    const handleMoodChange = (mood) => {
      setMoods({...moods,[mood]:!moods[mood]})
    }

    return (
        <Grid container>
            {Object.keys(moods).map((mood,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                    checked={moods[mood]}
                control={<Checkbox classes={{
                    root: classes.root,
                    checked: classes.checked
                  }} 
                  onChange={() => handleMoodChange(mood)}
                  name={mood} />}
                label={capitalizeString(mood)}
              />
                </Grid>
            ))}
        </Grid>
    )
}

export default Sentiments
