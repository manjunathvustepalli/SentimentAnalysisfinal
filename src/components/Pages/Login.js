import React, { useState, useEffect } from "react";
import axios from "axios";
import bg from "../../imgs/bg.png";
import {
  Grid,
  Card,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import green from "@material-ui/core/colors/green";
import { Link } from "react-router-dom";
import { Label } from "@material-ui/icons";
import cookies from "js-cookie";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

const styles = {
  background: {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
  },
  wrapper: {
    height: "100vh",
    display: "grid",
    placeItems: "center",
  },
  inputWrapper: {
    borderBottom: "2px solid #aaa",
    position: "relative",
    width: "100%",
    height: "20px",
    margin: "20px 0",
    padding: "10px 0",
  },
  inputIcon: {
    position: "absolute",
    left: "30px",
    color: "#aaa",
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    marginBottom: "20px",
  },
  margin: {
    margin: theme.spacing(1),
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

function Login(props) {
  const classes = useStyles();
  const [Username, setUsername] = useState();
  const [Password, setPassword] = useState();
  const [Password2, setPassword2] = useState();
  const [UserType, setUserType] = useState();

  const [SignUpFlag, setSignUpFlag] = useState(false)
  const [IncorrectFlag, setIncorrectFlag] = useState(false);

  const handleIncorrectEntry = () => {
    setIncorrectFlag(!IncorrectFlag)
  }

  const handleSignUp = () => {
    setSignUpFlag(!IncorrectFlag)
  }

  const Signin = () => {
    let data = new FormData();

    var formdata = new FormData();
    formdata.append("username", Username);
    formdata.append("password", Password);
    

    let config = {
      method: "post",
      url:
        "https://cors-anywhere.herokuapp.com/http://3.7.187.244:9100/auth/login/",

      data: formdata,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response));

        if (response.status === 200) {
          props.history.push({
            pathname: "/summary-dashboard",
          });
        }
        else {
          handleIncorrectEntry()
        }
      })
      .catch((error) => {
        console.log(error);
      });

  };

  const SignUp = () => {
    let data = new FormData();

    var formdata = new FormData();
    formdata.append("username", Username);
    formdata.append("email", Password);
    formdata.append("password1", Password);
    formdata.append("password2", Password2);
    
    let config = {
      method: "post",
      url:
        "https://cors-anywhere.herokuapp.com/http://3.7.187.244:9100/auth/login/",

      data: formdata,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response));

        if (response.status === 200) {
          props.history.push({
            pathname: "/summary-dashboard",
          });
        }
        else {
          handleIncorrectEntry()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  return (
    <div style={styles.background}>
      <Grid container>
        <Grid item xs={false} sm={false} md={6} lg={6}></Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <div style={styles.wrapper}>
            <Card
              style={{
                minHeight: "400px",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={require("../../imgs/logo.png")}
                className={classes.large}
              />
              <Typography variant="h6">
                SOCIAL MEDIA SENTIMENT ANALYSIS
              </Typography>
              <Typography variant="h6" style={{ color: "orange" }}>
                FOR GOVT. OF BANGLADESH
              </Typography>
              <label
                htmlfor="userName-input"
                style={{ display: "block", width: "100%" }}
              >
                <div style={styles.inputWrapper}>
                  <AccountCircle style={styles.inputIcon} />
                  <input
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter User Id"
                    id="userName-input"
                    style={{
                      width: "100%",
                      height: "25px",
                      border: "none",
                      outline: "none",
                      textAlign: "center",
                    }}
                  />
                  {IncorrectFlag ? <div/> : (
                    <Typography variant='subtitle2' style={{marginTop: 10, color: "#ff1744"}}>
                    Incorrect username or password!
                  </Typography>
                  )}
                </div>
              </label>

              <label
                htmlfor="password-input"
                style={{ display: "block", width: "100%" }}
              >
                <div style={styles.inputWrapper}>
                  <LockRoundedIcon style={styles.inputIcon} />
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    id="password-input"
                    style={{
                      width: "100%",
                      height: "25px",
                      border: "none",
                      outline: "none",
                      textAlign: "center",
                    }}
                  />
                  {IncorrectFlag ? <div/> : (
                    <Typography variant='subtitle2' style={{marginTop: 10, color: "#ff1744"}}>
                    Incorrect username or password!
                  </Typography>
                  )}
                </div>
              </label>

                {SignUpFlag ? (
                  <> 
                  <label
                htmlfor="password-input"
                style={{ display: "block", width: "100%" }}
              >
                <div style={styles.inputWrapper}>
                  <LockRoundedIcon style={styles.inputIcon} />
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Re-Enter Password"
                    id="re-password-input"
                    style={{
                      width: "100%",
                      height: "25px",
                      border: "none",
                      outline: "none",
                      textAlign: "center",
                    }}
                  />
                </div>
              </label>

              <label
                htmlfor="password-input"
                style={{ display: "block", width: "100%" }}
              >
                <div >
                  {/* <LockRoundedIcon style={styles.inputIcon} /> */}
                  <FormControl fullWidth size="small" required>
                  <InputLabel id="companyLabel">Select User Type</InputLabel>
                  <Select
                    labelId="companyLabel"
                    id="company"
                    onChange={(e) => 
                      setUserType(e.target.value), (e)=> console.log('event:', e.target.value)
                    }
                    fullWidth
                  >
                    <MenuItem key={"Admin"} value={"Admin"}>Admin</MenuItem>
                    <MenuItem key={"Analyst"} value={"Analyst"}>Analyst</MenuItem>
                  </Select>
                </FormControl>
                </div>
              </label>

                  </>
                ) : <div/>}
              
              <div></div>
              {SignUpFlag ? (
                <Button
                onClick={Signin}
                // onClick={()=> handleIncorrectEntry()}
                className={classes.button}
                variant="contained"
                style={{ margin: "10px" }}
                component={Link}
                // to=""
                fullWidth
              >
                ENTER
              </Button>
              ) : (
                <>
                  <Button
                onClick={Signin}
                // onClick={()=> handleIncorrectEntry()}
                className={classes.button}
                variant="contained"
                style={{ margin: "10px" }}
                component={Link}
                // to=""
                fullWidth
              >
                SIGN IN
              </Button>

              <Button
                onClick={handleSignUp}
                // onClick={()=> handleIncorrectEntry()}
                className={classes.button}
                variant="contained"
                style={{ margin: "10px" }}
                component={Link}
                // to=""
                fullWidth
              >
                SIGN UP
              </Button>
                </>
              )}
              
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
