import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { header } from "./Auth";
import {
  fade,
  ThemeProvider,
  withStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Cookies from "js-cookie";
import CircularProgress from "@material-ui/core/CircularProgress";

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});
  let token = Cookies.get("token");
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    // backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
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

export default function AddUser() {
  const classes = useStyles();
  const [Username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [Password, setPassword] = useState();
  const [Password2, setPassword2] = useState();
  const [UserType, setUserType] = useState();
  const [Roles, setRoles] = useState([]);
  const [loading,setloading]=useState(true);
  const GetRoles = async () => {
    let data = "";
let token=Cookies.get("token")
    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/getroles",
      headers: {
        "Content-Type": "application/json",
        token: token,
      }, 
      data: data,
    };

    let response=await axios(config)
     
    
    .catch((error) => {
      console.log(error);
    });
      if(response.status===201){
    await  setRoles(response.data.roles);
      }
      if(response.data.roles){

        setloading(false);
      }

  };
  useEffect(() => {
    GetRoles();
  }, []);

  const SignUp = () => {
  
    let data = JSON.stringify({
      user: {
        userName: Username,
        password: Password,
        displayName: email,
        roles: UserType,
      },
    });

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/adduser",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      {loading ? (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          display="flex"
          style={{ minHeight: "50vh" }}
        >
          <CircularProgress style={{ position: "absolute" }} />
        </Grid>
      ) : (
        <>
          <CssBaseline />
          <div className={classes.paper}>
            {/* <Avatar className={classes.avatar}>
            <PersonAddIcon />
          </Avatar> */}
            <Box p={3}>
              <Typography component="h1" variant="h5">
                Add User
              </Typography>
            </Box>
            <Grid container alignItems="center" justify="center" spacing={4}>
              <ThemeProvider theme={theme}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        autoComplete="fname"
                        name="firstName"
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="UserName"
                        style={{
                          borderColor: "green",
                          cssLabel: {
                            color: "green",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl variant="outlined" style={{ width: "100%" }}>
                        <InputLabel>UserType</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          // value={age}
                          onChange={(e) => setUserType(e.target.value)}
                          label="Age"
                        >
                          {Roles.map((role) => (
                            <MenuItem key={role.roleId} value={role.roleId}>
                              {role.roleName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="display name"
                        label="Display Name"
                        name="Display Name"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="Re-Enter Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword2(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid xs={10}>
                  <Button
                    onClick={SignUp}
                    //   type="submit"
                    fullWidth
                    className={classes.button}
                    variant="contained"
                    // color="primary"
                    //   className={classes.submit}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </ThemeProvider>
            </Grid>
          </div>
        </>
      )}
    </Container>
  );
}
