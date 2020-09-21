import React from 'react'

function CustomLegend(props) {
    return (
        <div style={{padding:'10px',display:'flex'}} >
            <div style={{backgroundColor:props.color,width:'10px',height:'10px',borderRadius:'50%'}}></div>
            <span style={{color:'black',fontSize:'12px',marginLeft:'6px',transform:'translateY(-4px)',cursor:'pointer'}}> {props.word} </span>
        </div>
    )
}

export default CustomLegend
