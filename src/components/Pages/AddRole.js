// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Avatar from "@material-ui/core/Avatar";
// import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
// import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
// import Typography from "@material-ui/core/Typography";
// import { makeStyles } from "@material-ui/core/styles";
// import Container from "@material-ui/core/Container";
// import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from "@material-ui/core/FormHelperText";
// import FormControl from "@material-ui/core/FormControl";
// import Select from "@material-ui/core/Select";
// import InputLabel from "@material-ui/core/InputLabel";
// import PersonAddIcon from "@material-ui/icons/PersonAdd";
// import { header } from "./Auth";
// import {
//   fade,
//   ThemeProvider,
//   withStyles,
//   createMuiTheme,
// } from "@material-ui/core/styles";
// import { green } from "@material-ui/core/colors";
// import Cookies from "js-cookie";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import Chip from "@material-ui/core/Chip";

// const theme = createMuiTheme({
//   palette: {
//     primary: green,
//   },
// });
// const useStyles = makeStyles((theme) => ({
//   paper: {
//     marginTop: theme.spacing(4),
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     // backgroundColor: theme.palette.secondary.main,
//   },
//   form: {
//     width: "100%", // Fix IE 11 issue.
//     marginTop: theme.spacing(3),
//   },
//   button: {
//     margin: theme.spacing(1),
//     padding: "15px 0",
//     color: "white",
//     display: "block",
//     textAlign: "center",
//     backgroundColor: `rgb(67,176,42)`,
//     "&:hover": {
//       backgroundColor: `rgb(67,176,42)`,
//     },
//   },
// }));
// export default function AddRole() {

//     useEffect(() => {
      
//       getUipages();
//     }, []);
//     const [uipages,setUipages]=useState();
//     const [roleName,setrolename]=useState();
//     const[roleDescription,setroledescription]=useState();
//     const[adduipages,setaddroledescription]=useState();

//     const getUipages = async () => {
//       let token = Cookies.get("token");
//       let config = {
//         method: "post",
//         url: process.env.REACT_APP_URL + "admin/getroles",
//         headers: {
//           "Content-Type": "application/json",
//           token: token,
//         },
//         data: "",
//       };

//        axios(config)
//          .then((response) => {
        
//              setUipages(response.data);
//          })
//          .catch((error) => {
//            console.log(error);
//          });
//     };
//     const addrole = async () => {
//       let token = Cookies.get("token");
//       let data = JSON.stringify({
//         role: {
//           roleName: "allanalysis",
//           roleDescription: "All analysis",
//           pageIds: "3,4,5,6,7,8",
//         },
//       });

//       let config = {
//         method: "post",
//         url:process.env.REACT_APP_URL+ "admin/addrole",
//         headers: {
//           "Content-Type": "application/json",
//           token: token,
//         },
//         data: data,
//       };

//       axios(config)
//         .then((response) => {
//           console.log(JSON.stringify(response.data));
//         })
//         .catch((error) => {
//           console.log(error);
//         });

//     };

//     const classes = useStyles();
//     return (
//       <div>
//         <Container component="main" maxWidth="xs">
//           <CssBaseline />
//           <div className={classes.paper}>
//             <Box p={3}>
//               <Typography component="h1" variant="h5">
//                 Add Role
//               </Typography>
//             </Box>
//             <Grid container alignItems="center" justify="center" spacing={4}>
//               <ThemeProvider theme={theme}>
//                 <Grid item xs={12}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                       <TextField
//                         autoComplete="fname"
//                         name="firstName"
//                         onChange={(e) => setrolename(e.target.value)}
//                         variant="outlined"
//                         required
//                         fullWidth
//                         id="firstName"
//                         label="RoleName"
//                         style={{
//                           borderColor: "green",
//                           cssLabel: {
//                             color: "green",
//                           },
//                         }}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <FormControl variant="outlined" style={{ width: "100%" }}>
//                         <InputLabel id="demo-mutiple-chip-label">
//                           PageIds
//                         </InputLabel>
//                         <Select
//                           labelId="demo-mutiple-chip-label"
//                           id="demo-mutiple-chip"
//                           multiple
//                           fullWidth
//                           //   value={}
//                           //   onChange={handleChange}

//                           renderValue={(selected) => (
//                             <div className={classes.chips}>
//                               {/* {selected.map((value) => (
//                                 <Chip
//                                   key={value}
//                                   label={value}
//                                   className={classes.chip}
//                                 />
//                               ))} */}
//                             </div>
//                           )}
//                           //   MenuProps={MenuProps}
//                         >
//                           {/* {uipages.map((name) => (
//                             <MenuItem
//                               key={name}
//                               value={name}
//                               style={getStyles(name, personName, theme)}
//                             >
//                               {name}
//                             </MenuItem>
//                           ))} */}
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         variant="outlined"
//                         required
//                         fullWidth
//                         name="roleDescription"
//                         label="RoleDescription"
//                         type="text"
//                         id="password"
//                         autoComplete="current-password"
//                         onChange={(e) => setroledescription(e.target.value)}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Grid>
//                 <Grid xs={10}>
//                   <Button
//                     // onClick={SignUp}
//                     //   type="submit"
//                     fullWidth
//                     className={classes.button}
//                     variant="contained"
//                   >
//                     Sign Up
//                   </Button>
//                 </Grid>
//               </ThemeProvider>
//             </Grid>
//           </div>
//         </Container>
//       </div>
//     );
// }
