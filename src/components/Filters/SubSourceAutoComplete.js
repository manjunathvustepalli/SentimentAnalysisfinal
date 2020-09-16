import React, { useEffect, useState } from 'react'
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


function SubSourceAutoComplete(props) {

    const [ subSources, setSubsources ] = props.subSources
    const [selectedSubsources, setSelectedSubsources] = useState(['All'])

    const handleChange = (e,arr) => {
        let obj = {}
        if(arr.includes('All')){
          Object.keys(subSources).forEach(subSource =>{
            obj[subSource] = true
          })
          setSelectedSubsources(['All'])
          setSubsources(obj)
        } else if (arr.length === 0){
          Object.keys(subSources).forEach(subSource =>{
            obj[subSource] = true
          })
          setSelectedSubsources([])
          setSubsources(obj)
        } else {
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
    }

    return (
      <div className={'autocomplete-wrapper'} style={{width:'100%'}}>
        <Autocomplete
        multiple
        fullWidth
        limitTags={2}
        id="tags-outlined"
        value={selectedSubsources}
        onChange={(e,arr) => handleChange(e,arr)}
        options={[...Object.keys(subSources),'All']}
        getOptionLabel={(option) => option}
        renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" style={{backgroundColor:'white',color:'black'}} label={option} {...getTagProps({ index })} />
            )) 
          }
        renderInput={(params) => (
          <TextField
            fullWidth
            {...params}
            variant="outlined"
            style={{color:'white'}}
            label="Select Subsource"
            placeholder="Subsources"
          />
        )}
      />
      </div>
    )
}

export default SubSourceAutoComplete
