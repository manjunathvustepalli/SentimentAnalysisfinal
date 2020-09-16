import React from 'react';
import Radio from '@material-ui/core/Radio';
import { FormControlLabel } from '@material-ui/core';

function RadioButtons(props) {
    const [selectedValue, setSelectedValue,selectingArray] = props.radio

    return (
        <div>
            {selectingArray.map((eachValue,i) => (
                <FormControlLabel value={eachValue} control={
                    <Radio
                    key={i}
                    checked={selectedValue === eachValue}
                    onChange = {(e) => setSelectedValue(e.target.value)}
                    value={eachValue}
                    style={{color:'white'}}
                    name="radio-button"
                    inputProps={{ 'aria-label': eachValue }}
                    />
                } label={eachValue} />
                
            ))}
        </div>
    )
}

export default RadioButtons
