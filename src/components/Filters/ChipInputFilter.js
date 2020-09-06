import React,{useState, useEffect} from 'react';
import ChipInput from 'material-ui-chip-input';


function ChipInputFilter(props) {

    const setKeywords = props.setKeywords
    return (
        <ChipInput
        fullWidth
        variant="outlined"
        label="Type Keyword"
        clearInputValueOnChange	
        onDelete
        onChange={(chips) => {
            setKeywords(chips)
        }}
        />
    )
}

export default ChipInputFilter