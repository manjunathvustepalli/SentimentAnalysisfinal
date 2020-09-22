import React from 'react'
import RefreshIcon from '@material-ui/icons/Refresh';
import Grid from '@material-ui/core/Grid';
import { Typography, Box, Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import PlayForWorkIcon from '@material-ui/icons/PlayForWork';


const IconWithText = styled.div`
  display: flex;
  align-items:center;
  justify-content:flex-start;
  color:white
`;

const styles = {
    root: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
  };

function FilterHeader(props) {

    const [ refresh,setRefresh ] = props.refresh

    const useStyles = makeStyles({
        buttonStyle:{
            border:'1px solid white',
            color:'white',
            '&:hover': {
                border:'1px solid white',
            }
        }
    })

    const classes = useStyles()
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var date = new Date();
    //get mm dd yyyy
    var mnth = monthNames[date.getMonth()];
    var dt = date.getDate();
    var yr = date.getFullYear();
    //get hh mm ss
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hour = date.getHours();
    //get AM/PM 
    var ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;

    return (
        <Card style={{backgroundColor:'#43B02A',height:'130px'}}>
            <CardContent>
                <Grid container>
                    <Grid xs={5} item align='left'>
                        <IconWithText>
                            <PlayForWorkIcon /> 
                            <p> Refresh Data </p>
                        </IconWithText>
                        
                    </Grid>
                <Grid xs={7} item align='right'>
                    <Typography style={{fontSize:'15px',color:'white'}}>
                        Last Refresh at {mnth + '-' + dt + '-'+ yr + ' ' + hour + ':'+ minutes + ':'+ seconds + ' ' + ampm}
                    </Typography>
                    <Button
                    style={{marginTop:'13px'}}
                    variant="outlined"
                    color="primary"
                    className={classes.buttonStyle}
                    startIcon={<RefreshIcon />}
                    onClick = { () => setRefresh(prev => !prev) }
                    >
                    Refresh
                    </Button>
                </Grid>
            </Grid>   
        </CardContent>
    </Card>
        
    )
}

export default FilterHeader
