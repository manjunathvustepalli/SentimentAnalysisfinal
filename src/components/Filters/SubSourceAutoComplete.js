import React, { useEffect, useState } from 'react'
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


function SubSourceAutoComplete(props) {

    const [ subSources, setSubsources ] = props.subSources
    const [selectedSubsources, setSelectedSubsources] = useState([])

    const handleChange = (e,arr) => {
        let obj = {}
        Object.keys(subSources).forEach(subSource => {
            if(arr.includes(subSource)){
                obj[subSource] = true
            } else {
                obj[subSource] = false
            }
        })
        setSelectedSubsources(arr)
        setSubsources(obj)
    }

    return (
            <Autocomplete
        multiple
        fullWidth
        id="tags-outlined"
        value={selectedSubsources}
        defaultValue={Object.keys(subSources)}
        onChange={(e,arr) => handleChange(e,arr)}
        options={Object.keys(subSources)}
        getOptionLabel={(option) => option}
        renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
        renderInput={(params) => (
          <TextField
            fullWidth
            {...params}
            variant="outlined"
            label="Select Subsource"
            placeholder="Subsources"
          />
        )}
      />
    )
}

export default SubSourceAutoComplete
