import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'

function SubSourceSingleAutoComplete(props) {
    const [subSource,setSubSource,subSources] = props.subSources
    return (
        <Autocomplete
            id="Autocomplete-subSources"
            options={subSources}
            getOptionLabel={(option) => option}
            fullWidth
            value={subSource}
            onChange={(e,newValue) =>{
                setSubSource(newValue)
            }}
            renderInput={(params) => <TextField {...params} label="Sub Source" variant="outlined" />}
        />
    )
}

export default SubSourceSingleAutoComplete
