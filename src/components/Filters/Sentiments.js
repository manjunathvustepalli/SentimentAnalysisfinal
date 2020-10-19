import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Checkbox,} from '@material-ui/core';


function Sentiments(props) {

    const [sentiments, setSentiment] = props.sentiments

    const handleSentimentChange = (sentiment) => {
      setSentiment({...sentiments,[sentiment]:!sentiments[sentiment]})
    }


    return (
        <Grid container>
            {Object.keys(sentiments).map((sentiment,i) =>(
                <Grid item xs={6} key={i} align='left'>
                    <FormControlLabel
                control={<Checkbox
                  checked={sentiments[sentiment]}
                  style={{ color: "white" }}
                  onChange={() => handleSentimentChange(sentiment)} name={sentiment} />}
                label={sentiment}
              />
                </Grid>
            ))}
        </Grid>
    )
}

export default Sentiments
