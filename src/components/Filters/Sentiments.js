import React,{useState} from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Checkbox, makeStyles } from '@material-ui/core';


function Sentiments(props) {

    const [sentiments, setSentiment] = props.sentiments
    const useStyles = makeStyles({
        root: {
          "&$checked": {
            color: "#43B02A"
          },
        },
        checked: {}
      })

    const handleSentimentChange = (sentiment) => {
      setSentiment({...sentiments,[sentiment]:!sentiments[sentiment]})
    }

    const classes = useStyles()

    return (
        <Grid container>
            {Object.keys(sentiments).map((sentiment,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Checkbox
                  checked={sentiments[sentiment]}
                  classes={{
                    root: classes.root,
                    checked: classes.checked
                  }} onChange={() => handleSentimentChange(sentiment)} name={sentiment} />}
                label={sentiment}
              />
                </Grid>
            ))}
        </Grid>
    )
}

export default Sentiments
