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
import Cookies from "js-cookie";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
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
  visibleIcon: {
    top: "2px",
    position: "absolute",
    right: "10px",
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
  const [email, setEmail] = useState();
  const [Password, setPassword] = useState();
  const [Password2, setPassword2] = useState();
  const [UserType, setUserType] = useState();
  const [SignUpFlag, setSignUpFlag] = useState(false);
  const [IncorrectFlag, setIncorrectFlag] = useState(false);
  const [PasswordMatch, setPasswordMatch] = useState(true);
  const [hidden, setHidden] = useState(true);
  const handleIncorrectEntry = () => {
    setIncorrectFlag(!IncorrectFlag);
  };
  const setCookies = async (response) => {
    await Cookies.set("token", response.data.token);
    let pages=[];
    response.data.pages.map((page)=>{
      pages.push(page.pageUrl);
    })
    await Cookies.set("pages", pages);
    if (response.status === 201) {
      setIncorrectFlag(false);
      props.history.push({
        pathname: "/summary-dashboard",
      });
    } else {
      setIncorrectFlag(true);
    }
  };
  const handleSignUpFlag = () => {
    setSignUpFlag(!SignUpFlag);
  };

  const handlePasswordMatch = () => {
    if (Password === Password2) {
      setPasswordMatch(false);
    }
  };

  const Signin = async () => {
    let data = JSON.stringify({
      userName: Username,
      password: Password,
      forceLogin: true,
    });

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    let response = await axios(config).catch((error) => setIncorrectFlag(true));
    if (response) {
      // console.log(response);
      await setCookies(response);
    }
  };

  const SignUp = () => {
    let data = new FormData();

    var formdata = new FormData();
    formdata.append("username", Username);
    formdata.append("email", email);
    formdata.append("password1", Password);
    formdata.append("password2", Password2);
    formdata.append("userType", UserType);

    let config = {
      method: "post",
      url:
        "https://cors-anywhere.herokuapp.com/http://3.7.187.244:9100/auth/registration/",

      data: formdata,
    };

    axios(config)
      .then((response) => {
        // console.log(JSON.stringify(response));

        if (response.status === 201) {
          //setIncorrectFlag(false);
          setSignUpFlag(false);
          // props.history.push({
          //   pathname: "/summary-dashboard",
          // });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

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
                  {!IncorrectFlag ? (
                    <div />
                  ) : (
                    <Typography
                      variant="subtitle2"
                      style={{ marginTop: 10, color: "#ff1744" }}
                    >
                      Incorrect username or password!
                    </Typography>
                  )}
                </div>
              </label>
              {/* <label
                htmlfor="userName-input"
                style={{ display: "block", width: "100%" }}
              >
                <div style={styles.inputWrapper}>
                  <AccountCircle style={styles.inputIcon} />
                  <input
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    id="userName-input"
                    style={{
                      width: "100%",
                      height: "25px",
                      border: "none",
                      outline: "none",
                      textAlign: "center",
                    }}
                  />
                  {!IncorrectFlag ? (
                    <div />
                  ) : (
                    <Typography
                      variant="subtitle2"
                      style={{ marginTop: 10, color: "#ff1744" }}
                    >
                      Email might already exist
                    </Typography>
                  )}
                </div>
              </label> */}

              <label
                htmlfor="password-input"
                style={{ display: "block", width: "100%" }}
              >
                <div style={styles.inputWrapper}>
                  <LockRoundedIcon style={styles.inputIcon} />
                  <input
                    type={hidden ? "password" : "text"}
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
                  <IconButton
                    onClick={() => setHidden(!hidden)}
                    style={styles.visibleIcon}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {!IncorrectFlag ? (
                    <div />
                  ) : (
                    <Typography
                      variant="subtitle2"
                      style={{ marginTop: 10, color: "#ff1744" }}
                    >
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
                        onChange={(e) => setPassword2(e.target.value)}
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
                    {Password === Password2 ? (
                      <div />
                    ) : (
                      <Typography
                        variant="subtitle2"
                        style={{ marginTop: 10, color: "#ff1744" }}
                      >
                        Password do not match!
                      </Typography>
                    )}
                  </label>

                  <label
                    htmlfor="password-input"
                    style={{ display: "block", width: "100%" }}
                  >
                    <div>
                      {/* <LockRoundedIcon style={styles.inputIcon} /> */}
                      <FormControl fullWidth size="small" required>
                        <InputLabel id="companyLabel">
                          Select User Type
                        </InputLabel>
                        <Select
                          labelId="companyLabel"
                          id="company"
                          onChange={(e) => setUserType(e.target.value)}
                          fullWidth
                        >
                          <MenuItem key={"admin"} value={"Admin"}>
                            Admin
                          </MenuItem>
                          <MenuItem key={"anlyt"} value={"Analyst"}>
                            Analyst
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </label>
                </>
              ) : (
                <div />
              )}

              <div></div>
              {SignUpFlag ? (
                <>
                  <Button
                    onClick={SignUp}
                    // onClick={()=> handleIncorrectEntry()}
                    //  disabled={PasswordMatch}
                    className={classes.button}
                    variant="contained"
                    style={{ margin: "10px" }}
                    component={Link}
                    // to=""
                    fullWidth
                  >
                    ENTER
                  </Button>

                  <Button
                    onClick={() => setSignUpFlag(false)}
                    // onClick={()=> handleIncorrectEntry()}
                    className={classes.button}
                    variant="contained"
                    style={{ margin: "10px" }}
                    component={Link}
                    // to=""
                    fullWidth
                  >
                    BACK
                  </Button>
                </>
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

                  {/* <Button
                    onClick={handleSignUpFlag}
                    // onClick={()=> handleIncorrectEntry()}
                    className={classes.button}
                    variant="contained"
                    style={{ margin: "10px" }}
                    component={Link}
                    // to=""
                    fullWidth
                  >
                    SIGN UP
                  </Button> */}
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
