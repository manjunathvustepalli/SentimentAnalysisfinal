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
import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});
const useStyles = makeStyles((theme) => ({
  formControl: {
    variant: "outlined",
    margin: theme.spacing(1),
    minWidth: "100%",
    maxWidth: 300,
  },
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
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
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
export default function AddRole() {
  useEffect(() => {
    // getUipages();
  }, []);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 7.5 + ITEM_PADDING_TOP,
        width: 550,
      },
    },
  };
  const [uipages, setUipages] = useState([
    {
      pageId: 1,
      pageUrl: "Admin Page",
    },
    {
      pageId: 2,
      pageUrl: "Add User",
    },
    {
      pageId: 9,
      pageUrl: "Summary Dashboard",
    },
    {
      pageId: 10,
      pageUrl: "Sentiment Analysis",
    },
    {
      pageId: 11,
      pageUrl: "Mood Analysis",
    },
    {
      pageId: 12,
      pageUrl: "Word Cloud",
    },
    {
      pageId: 13,
      pageUrl: "Trend Analysis",
    },
    {
      pageId: 14,
      pageUrl: "Live Analysis",
    },
    {
      pageId: 15,
      pageUrl: "Export Data",
    },
    {
      pageId: 16,
      pageUrl: "Fetch",
    },
    {
      pageId: 17,
      pageUrl: "Search",
    },
    {
      pageId: 18,
      pageUrl: "Search Image",
    },
    {
      pageId: 19,
      pageUrl: "Trending Subject",
    },
    {
      pageId: 20,
      pageUrl: "Get Sources",
    },
    {
      pageId: 21,
      pageUrl: "Influencer Analysis",
    },
    {
      pageId: 22,
      pageUrl: "Update/Delete User",
    },
    {
      pageId: 23,
      pageUrl: "Change Password",
    },
    {
      pageId: 24,
      pageUrl: "Geo HotSpot Analysis",
    },
    {
      pageId: 25,
      pageUrl: "Demography",
    },
    {
      pageId: 26,
      pageUrl: "Behavior Analysis",
    },
  ]);
  const [roleName, setrolename] = useState();
  const [roleDescription, setroledescription] = useState();
  const [adduipages, setaddroledescription] = useState();
  const [personName, setPersonName] = useState([]);
  const [role,setrole]=useState()
  let roles = "";
  const handleChange = async (event) => {
    setPersonName(event.target.value);
   
    
  };
  const getUipages = async () => {
    let token = Cookies.get("token");
    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/getpages",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: "",
    };

    axios(config)
      .then((response) => {
        setUipages(response.data.pages);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addroleapi = async () => {
     await personName.map((role) => {
       roles=roles.concat(role.pageId+",");
      console.log(role);
         });
         roles=roles.slice(0,-1)
    
    let token = Cookies.get("token");
    let data = JSON.stringify({
      role: {
        roleName: roleName,
        roleDescription: roleDescription,
        pageIds: roles,
      },
    });

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/addrole",
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

  const classes = useStyles();
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Box p={3}>
            <Typography component="h1" variant="h5">
              Add Role
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
                      onChange={(e) => setrolename(e.target.value)}
                      variant="outlined"
                      required
                      fullWidth
                      id="firstName"
                      label="RoleName"
                      style={{
                        borderColor: "green",
                        cssLabel: {
                          color: "green",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      // className={classes.formControl}
                      variant="outlined"
                      style={{ width: "100%" }}
                    >
                      <InputLabel id="demo-mutiple-chip-label">
                        Page Name
                      </InputLabel>
                      <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={(selected) => (
                          <div className={classes.chips}>
                            {selected.map((value) => (
                              <Chip
                                key={value.pageId}
                                label={value.pageUrl}
                                className={classes.chip}
                              />
                            ))}
                          </div>
                        )}
                        MenuProps={MenuProps}
                      >
                        {uipages.map((page) => (
                          <MenuItem key={page.pageId} value={page}>
                            {page.pageUrl}
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
                      name="roleDescription"
                      label="RoleDescription"
                      type="text"
                      id="password"
                      autoComplete="current-password"
                      onChange={(e) => setroledescription(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={10}>
                <Button
                  onClick={addroleapi}
                  //   type="submit"
                  fullWidth
                  className={classes.button}
                  variant="contained"
                >
                  Sign Up
                </Button>
              </Grid>
            </ThemeProvider>
          </Grid>
        </div>
      </Container>
    </div>
  );
}
