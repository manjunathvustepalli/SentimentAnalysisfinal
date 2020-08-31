import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { FormControlLabel } from '@material-ui/core';

const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

function RadioButtons(props) {
    const [selectedValue, setSelectedValue,selectingArray] = props.radio

    return (
        <div>
            {selectingArray.map((eachValue,i) => (
                <FormControlLabel value={eachValue} control={
                    <GreenRadio
                    key={i}
                    checked={selectedValue === eachValue}
                    onChange = {(e) => setSelectedValue(e.target.value)}
                    value={eachValue}
                    name="radio-button"
                    inputProps={{ 'aria-label': eachValue }}
                    />
                } label={eachValue} />
                
            ))}
        </div>
    )
}

export default RadioButtons
