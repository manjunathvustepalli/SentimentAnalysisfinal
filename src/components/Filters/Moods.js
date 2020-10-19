import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Checkbox} from '@material-ui/core';
import { capitalizeString } from '../../helpers';


function Sentiments(props) {

    const [moods, setMoods] = props.moods 

    const handleMoodChange = (mood) => {
      setMoods({...moods,[mood]:!moods[mood]})
    }

    return (
        <Grid container>
            {Object.keys(moods).map((mood,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                    checked={moods[mood]}
                control={<Checkbox 
                  style={{color:'white'}}
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
