import React from 'react';
import ChipInput from 'material-ui-chip-input';


function ChipInputFilter(props) {

    const {setKeywords,keywords} = props
    return (
        <ChipInput
        fullWidth
        variant="outlined"
        label="Type Keyword"
        defaultValue={keywords}
        InputLabelProps={{style:{
            color:'white'
        }}}
        InputProps={{style:{
            color:'white',
        }}}
        style={{transform:props.transform ? 'translateY(20%)' : ''}}
        onChange={(chips) => {
            setKeywords(chips)
        }}
        />
    )
}

export default ChipInputFilter