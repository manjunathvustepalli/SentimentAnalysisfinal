import React,{useState} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Checkbox, makeStyles } from '@material-ui/core';
import { capitalizeString } from '../../helpers';

function Languages(props) {

    const [languages, setLanguages] = props.languages

      const handleLanguageChange = (language) => {
        setLanguages({...languages,[language]:!languages[language]})
      }

    return (
        <Grid container>
            {Object.keys(languages).map((language,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Checkbox name="checkedA"
                style={{color:'white'}}
                checked={languages[language]}
                onChange={() => handleLanguageChange(language)}
                />}
                label={capitalizeString(language==='unknown' ? ('Others') : (language) )}
              />
                </Grid>
            ))}
        </Grid>
    )
}

export default Languages
