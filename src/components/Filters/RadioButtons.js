import React from 'react';
import Radio from '@material-ui/core/Radio';
import { FormControlLabel } from '@material-ui/core';

function RadioButtons(props) {
    const [selectedValue, setSelectedValue,selectingArray,changeData,type] = props.radio

    return (
        <div>
            {selectingArray.map((eachValue,i) => (
                <FormControlLabel key={i} value={eachValue} control={
                    <Radio
                    checked={selectedValue === eachValue}
                    onChange = {(e) => {
                        setSelectedValue(e.target.value)
                        if(type){
                            changeData(type,e.target.value)
                        }
                    }}
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
