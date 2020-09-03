import React from 'react'
import bg from '../../imgs/bg.png'
import { Grid, Card, Avatar, Typography, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import green from '@material-ui/core/colors/green';
import { Link } from 'react-router-dom';

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
    },
    margin: {
        margin: theme.spacing(1),
      },
    button:{
        margin: theme.spacing(1),
        color:'white',
        display:'block',
        textAlign:'center',
        backgroundColor:green[800],
        '&:hover': {
            backgroundColor:green[800],
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
                    <Card style={{minHeight:'300px',padding:'30px',display:'flex',flexDirection:'column',alignItems:'center'}} >
                        <Avatar src={require('../../imgs/logo.png')} className={classes.large} />
                        <Typography variant='h6'>
                            SOCIAL MEDIA SENTIMENT ANALYSIS
                        </Typography>
                        <Typography variant='h6' style={{color:'orange'}}>
                            FOR GOVT. OF BANGLADESH
                        </Typography>
                        <div className={classes.margin}>
                            <Grid container spacing={3} alignItems="flex-end">
                            <Grid item>
                                <AccountCircle />
                            </Grid>
                            <Grid item>
                                <TextField id="user-id" fullWidth label="User Id" />
                            </Grid>
                            </Grid>
                        </div>
                        <div className={classes.margin}>
                            <Grid container spacing={3} alignItems="flex-end">
                            <Grid item>
                                <LockRoundedIcon />
                            </Grid>
                            <Grid item>
                                <TextField id="password" type="password" fullWidth label="Password" />
                            </Grid>
                            </Grid>
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
