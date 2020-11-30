import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import Cookies from "js-cookie";
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import ChipInput from "material-ui-chip-input";
import {
  Button,
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { DeleteForeverOutlined } from "@material-ui/icons";

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
    margin: theme.spacing(0.5),
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
export default function Changedeleterole() {
  let roles = {};
  let uroles = {};
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(true);
  const [dloading, setDloading] = useState(true);
  const [rolename, setrolename] = useState();
  const [roleDescription, setroledescription] = useState();
  const [uipages, setUipages] = useState([]);
  const [personName, setPersonName] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [edit, setedit] = useState(false);
  const [editrowdata, seteditrowdata] = useState();
  const [editid, seteditid] = useState();
  const classes = useStyles();
  let mroles = {};
  const handleChange = (event, arr) => {
    console.log(arr);
    setPersonName(arr);
  };

  useEffect(() => {
    getUipages();
    getRoles();
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
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });
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

    let response = await axios(config).catch((error) => {
      console.log(error);
    });
    uroles = await response.data.pages;
    await setUipages(response.data.pages);
    await response.data.pages.map((index) => {
      roles[index.pageId] = index.pageUrl;
      setAllRoles(roles);
    });
  };
  const updaterole = async () => {
    setedit(false);
    let uipages = [];
    personName.map((id) => uipages.push(id.pageId));
    let token = Cookies.get("token");
    let data = JSON.stringify({
      role: {
        roleId: editid,
        roleName: rolename,
        roleDescription: roleDescription,
        pageIds: uipages,
      },
    });

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/modifyrole",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    await axios(config)
      .then((response) => {
        getRoles();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const Deleterole = (olddata) => {
    let token = Cookies.get("token");
    let data = JSON.stringify({ role: { roleId: olddata.roleId } });

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/deleterole",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        return getRoles();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleedit = async (rowData) => {
    setedit(true);
    let prole = [];
    seteditrowdata(rowData);

    await rowData.pageIds.map((id) => {
      uroles.map((uid) => (uid.pageId === id ? prole.push(uid) : null));

      setDloading(false);
    });
    await setPersonName(prole);
    await setrolename(rowData.roleName);
    await setroledescription(rowData.roleDescription);
    await seteditid(rowData.roleId);
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

    await axios(config)
      .then((response) => {
        setdata(response.data.roles);
        setloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [columns, setColumns] = useState([
    { title: "Role Name", field: "roleName", editable: "never" },
    { title: "Role Description", field: "roleDescription" },

    {
      title: "Page Ids",
      field: "pageIds",
      render: (rowData) =>
        rowData.pageIds.map((data, index) =>
          roles[data] ? (
            <Chip
              // icon={icon}
              label={roles[data]}
              className={classes.chip}
            />
          ) : null
        ),
    },
    {
      title: "Update Role",
      editable: "never",
      render: (rowData) => (
        <Button
          onClick={() => {
            handleedit(rowData);
          }}
        >
          <EditIcon />
        </Button>
      ),
    },
  ]);
  return (
    <>
      {loading ? (
        <Grid
          container
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
          <MaterialTable
            title="Users"
            columns={columns}
            data={data}
            editable={{
              onRowDelete: (oldData, newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    Deleterole(oldData);
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
            localization={{
              body: {
                editRow: {
                  deleteText: "Are you sure you want to delete the Role?",
                },
              },
            }}
            options={{
              paging: false,
              // tableLayout: "fixed",
              actionsColumnIndex: -1,
              maxBodyHeight: 500,
              headerStyle: {
                backgroundColor: "rgb(67, 176, 42)",
                color: "white",
                paddingTop: "10px",
                paddingBottom: "10px",
              },
            }}
          />

          <Dialog
            fullWidth
            style={{ height: "700px" }}
            open={edit}
            onClose={() => setedit(false)}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {" "}
              Update Role{" "}
            </DialogTitle>
            {dloading ? (
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
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        value={rolename}
                        name="Role Name"
                        label="Role Name"
                        type="text"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setrolename(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        fullWidth
                        limitTags={2}
                        id="tags-outlined"
                        value={personName}
                        onChange={(e, arr) => handleChange(e, arr)}
                        options={uipages}
                        getOptionLabel={(option) => option.pageUrl}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="outlined"
                              style={{
                                backgroundColor: "white",
                                color: "black",
                              }}
                              label={option.pageUrl}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            variant="outlined"
                            style={{ color: "white" }}
                            label="Select one or more roles"
                            placeholder="Subsources"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        value={roleDescription}
                        name="Role description"
                        label="Role description"
                        type="text"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setroledescription(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </DialogContentText>
              </DialogContent>
            )}
            <DialogActions>
              <Button className={classes.root} onClick={() => updaterole()}>
                Update Role
              </Button>
              <Button className={classes.root} onClick={() => setedit(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
