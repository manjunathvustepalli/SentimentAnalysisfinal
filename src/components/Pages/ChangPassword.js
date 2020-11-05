import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { green } from "@material-ui/core/colors";
import { header } from './Auth';
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    padding: "15px 0",
    color: "white",
    display: "block",
    textAlign: "center",
    backgroundColor: `rgb(67,176,42)`,
    "&:hover": {
      backgroundColor: `rgb(67,176,42)`,
    },
  },
}));

const theme = createMuiTheme({
    palette: {
      primary: green,
    },
  });

export default function SignIn() {
  const classes = useStyles();
  const [password1,setpassword1]=useState();
  const[password2,setpassword2]=useState();
const changepassword=()=>{
 
  let data = JSON.stringify({
    user: { password: password1, oldPassword: password2 },
  });

  let config = {
    method: "post",
    url: process.env.REACT_APP_URL + "admin/changepassword",
    headers: header,
    data: data,
  };

  axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

}
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <ThemeProvider theme={theme}>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="oldpassword"
            label="Old Password"
            onChange={(e)=>setpassword1(e.target.value)}
            type="password"
            name="oldpassword"
            autoComplete="oldpassword"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={(e)=>setpassword2(e.target.value)}
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            autoComplete="newPassword"
          />

          <Button
            // type="submit"
            fullWidth
            variant="contained"
            // color="primary"
            onClick={()=>changepassword()}
            className={classes.button}
          >
            Submit
          </Button>

        </form>
        </ThemeProvider>
      </div>
    </Container>
  );
}