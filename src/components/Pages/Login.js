import React from 'react'
import bg from '../../imgs/bg.png'
import { Grid, Card, Avatar, Typography, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import green from '@material-ui/core/colors/green';
import { Link } from 'react-router-dom';
import { Label } from '@material-ui/icons';

const styles = {
    background:{
        width:'100vw',
        height:'100vh',
        backgroundImage:`url(${bg})`,
        backgroundSize:'cover'
    },
    wrapper:{
        height:'100vh',
        display:'grid',
        placeItems:'center',
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
      marginBottom:'20px'
    },
    margin: {
        margin: theme.spacing(1),
      },
    button:{
        margin: theme.spacing(1),
        padding:'15px 0',
        color:'white',
        display:'block',
        textAlign:'center',
        backgroundColor:`rgb(67,176,42)`,
        '&:hover': {
            backgroundColor:`rgb(67,176,42)`,
        }
    }
  }));

function Login() {
    const classes = useStyles()
    return (
        <div style={styles.background}>
            <Grid container>
                <Grid item xs={false} sm={false} md={6} lg={6}> 
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <div style={styles.wrapper}>
                    <Card style={{minHeight:'400px',padding:'30px',display:'flex',flexDirection:'column',alignItems:'center'}} >
                        <Avatar src={require('../../imgs/logo.png')} className={classes.large} />
                        <Typography variant='h6'>
                            SOCIAL MEDIA SENTIMENT ANALYSIS
                        </Typography>
                        <Typography variant='h6' style={{color:'orange'}}>
                            FOR GOVT. OF BANGLADESH
                        </Typography>
                            <label htmlfor="userName-input" style={{display:'block',width:'100%'}} >
                            <div style={{borderBottom:'2px solid #aaa',width:'100%',height:'20px',margin:'20px 0',padding:'10px 0',display:'flex'}}>
                                <AccountCircle style={{marginLeft:'40px',color:'#aaa'}}/>
                                <input type='text'  placeholder="Enter User Id" id="userName-input" style={{width:'70%',marginLeft:'40px',height:'25px',border:'none',outline:'none'}} />
                            </div>
                            </label>
                            <label htmlfor="password-input" style={{display:'block',width:'100%'}}>
                                <div style={{borderBottom:'2px solid #aaa',width:'100%',height:'20px',margin:'20px 0',padding:'10px 0',display:'flex'}}>
                                    <LockRoundedIcon style={{marginLeft:'40px',color:'#aaa'}} />
                                    <input type='password' placeholder="Enter Password" id="password-input" style={{width:'70%',marginLeft:'40px',height:'25px',border:'none',outline:'none'}} />
                                </div>
                            </label>
                        <div>
                            
                        </div>
                        <Button
                            className={classes.button}
                            variant="contained"
                            style={{margin:"10px"}}
                            component={Link}
                            to="/summary-dashboard"
                            fullWidth
                            >
                            Enter                                                                       
                        </Button>
                    </Card>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login
