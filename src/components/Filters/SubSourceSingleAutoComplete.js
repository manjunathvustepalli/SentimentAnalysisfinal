import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'

function SubSourceSingleAutoComplete(props) {
    const [subSource,setSubSource,subSources,changeData,type] = props.subSources
    return (
        <div id='autocomplete-subsource' style={{width:'100%'}}>
            <Autocomplete
            id="Autocomplete-subSources"
            options={subSources}
            getOptionLabel={(option) => option}
            fullWidth
            value={subSource}
            onChange={(e,newValue) =>{
                setSubSource(newValue)
                if(type){
                    changeData(type,newValue)
                }
            }}
            renderInput={(params) => <TextField {...params} label="Sub Source" variant="outlined" />}
        />
        </div>
    )
}

export default SubSourceSingleAutoComplete
