import React,{useState} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Checkbox, makeStyles } from '@material-ui/core';
import { capitalizeString } from '../../helpers';

function Languages(props) {

    const [languages, setLanguages] = props.languages
    const useStyles = makeStyles({
        root: {
          "&$checked": {
            color: "#43B02A"
          },
        },
        checked: {}
      })
      const classes = useStyles()

      const handleLanguageChange = (language) => {
        setLanguages({...languages,[language]:!languages[language]})
      }

    return (
        <Grid container>
            {Object.keys(languages).map((language,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Checkbox name="checkedA"
                classes={{
                    root: classes.root,
                    checked: classes.checked
                  }}
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
