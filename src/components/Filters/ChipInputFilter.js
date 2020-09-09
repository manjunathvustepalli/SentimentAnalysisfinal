import React,{useState, useEffect} from 'react';
import ChipInput from 'material-ui-chip-input';


function ChipInputFilter(props) {

    const {setKeywords,keywords} = props
    return (
        <ChipInput
        fullWidth
        variant="outlined"
        label="Type Keyword"
        defaultValue={keywords}        
        style={{transform:props.transform ? 'translateY(20%)' : ''}}
        onChange={(chips) => {
            setKeywords(chips)
        }}
        />
    )
}

export default ChipInputFilter