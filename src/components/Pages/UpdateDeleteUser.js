import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import {
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { header } from "./Auth";
import axios from "axios";
import MaterialTable from "material-table";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import { getRoles } from "@testing-library/react";
import Cookies from "js-cookie";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));
let roles = {};
export default function UpdateDeleteUser() {
  const [data, setdata] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [Username, setUsername] = useState();
  const [Displayname, setDisplayname] = useState();
  const [Roles, setRoles] = useState();
  const [helpertext, setHelpertext] = useState(false);
  const [helpertext1, setHelpertext1] = useState(false);
  const [NewPassword, setNewPassword] = useState();
  const [loading, setloading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [UserId, setUserId] = useState();

  const [id, setid] = useState();

  const onClickResetPassword = (userId) => {
    setOpen(true);
    setid(userId);
    console.log(userId);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlepassword = (event) => {
    setNewPassword(event.target.value);
    setHelpertext1("");
    setHelpertext(false);
  };

  const deleteuser = (id) => {
    let token = Cookies.get("token");
    let data = JSON.stringify({ user: { userId: id } });

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/deleteuser",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        getUsers();
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(id);
  };

  const changePassword = (id, newPassword) => {
    let token = Cookies.get("token");
    let data = JSON.stringify({
      user: {
        userId: id,
        password: newPassword,
      },
    });

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/resetpassword",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        if (response.data.status === "Failure") {
          setHelpertext(true);
          setHelpertext1(response.data.errMsg);
        } else {
          handleClose();
        }
        // getUsers();
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(data);
  };

  const updateuser = (id, usernmae, displayName, role) => {
    let token = Cookies.get("token");
    let data = JSON.stringify({
      user: {
        userId: id,
        userName: usernmae,
        displayName: displayName,
        roles: role,
      },
    });

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/modifyuser",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        getUsers();
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(id);
  };

  const getUsers = () => {
    let token = Cookies.get("token");
    console.log({token})
    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/getusers",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: "",
    };

    axios(config)
      .then((response) => {
        setdata(response.data.users);
        setloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRoles = async () => {
    let token = Cookies.get("token");
    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/getroles",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: "",
    };

    let response = await axios(config).catch((error) => {
      console.log(error);
    });
    if (response.status === 201) {
      await response.data.roles.map((index) => {
        roles[index.roleId] = index.roleName;
        setAllRoles(roles);
      });
    }
    setloading(false);

    // setAllRoles(response.data.roles);
    console.log("ALLROLES:", roles);
    console.log("ALLROLES:", response.data.roles);
  };

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const [columns, setColumns] = useState([
    { title: "Username", field: "userName", editable: "never" },
    { title: "Display name", field: "displayName" },
    {
      title: "Roles",
      field: "roles",
      // lookup: { 1: "SuperAdmin", 2: "Admin", 4: "allanalysis" },
      lookup: roles,
    },

    {
      title: "Login Status",
      field: "loginStatus",
      editable: "never",
    },
    {
      title: "Reset Passowrd",
      editable: "never",
      render: (rowData) => (
        <Button
          onClick={() => {
            onClickResetPassword(rowData.userId);
          }}
        >
          <RotateLeftIcon />
        </Button>
      ),
    },
  ]);

  // const [data, setData] = useState([
  //   { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
  //   { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
  // ]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2} style={{ padding: 20 }} direction="column">
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
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Typography
                variant="h"
                className={classes.title}
                style={{ color: "#43B02A", fontSize: "30px" }}
              >
                Update/Delete Users
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined"></Paper>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.demo}>
                <List>
                  <MaterialTable
                    title="Users"
                    columns={columns}
                    data={data}
                    editable={{
                      // onRowAdd: newData =>
                      //   new Promise((resolve, reject) => {
                      //     setTimeout(() => {
                      //       setData([...data, newData]);

                      //       resolve();
                      //     }, 1000)
                      //   }),

                      onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            setUsername(newData.userName);
                            setDisplayname(newData.displayName);
                            setRoles(newData.roles);
                            updateuser(
                              newData.userId,
                              newData.userName,
                              newData.displayName,
                              newData.roles
                            );
                            // dataUpdate[index] = newData;
                            // setData([...dataUpdate]);
                            resolve();
                          }, 1000);
                        }),

                      onRowDelete: (oldData, newData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            // const dataDelete = [...data];
                            deleteuser(oldData.userId);
                            // dataDelete.splice(index, 1);
                            // setData([...dataDelete]);

                            resolve();
                          }, 1000);
                        }),
                    }}
                    style={{
                      padding: "20px",
                    }}
                    title="Users"
                    columns={columns}
                    data={data}
                    // actions={[
                    //   {
                    //     icon: "delete",
                    //     tooltip: "Delete User",
                    //     onClick: (event, rowData) => delete(rowData.userId),
                    //   }
                    // ]}
                    localization={{
                      body: {
                        editRow: {
                          deleteText:
                            "Are you sure you want to delete the user?",
                        },
                      },
                    }}
                    options={{
                      paging: false,
                      // tableLayout: "fixed",
                      maxBodyHeight: 500,
                      headerStyle: {
                        backgroundColor: "rgb(67, 176, 42)",
                        color: "white",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      },
                    }}
                  />
                </List>
              </div>
            </Grid>

            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter the new password below.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="password"
                  label="New Password"
                  type="password"
                  error={helpertext}
                  helperText={helpertext ? helpertext1 : null}
                  onChange={(event) => handlepassword(event)}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    changePassword(id, NewPassword);
                  }}
                  color="primary"
                >
                  Change Password
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Grid>
    </div>
  );
}
