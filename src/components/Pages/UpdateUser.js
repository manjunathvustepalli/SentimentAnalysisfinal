import React,{useEffect,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem';
import { ListSubheader } from "@material-ui/core";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {Divider, Paper} from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import { header } from './Auth';
import axios from 'axios'
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import { forwardRef } from "react";

import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

export default function InteractiveList() {
  const [Username, setUsername] = useState();
  const [Displayname, setDisplayname] = useState();
  const [Roles, setRoles] = useState();

  const [data,setdata]=useState([]);

  const updateuser=(id)=>{
    let data = JSON.stringify({
        user: {
            userId: id,
            userName: Username,
            displayName: Displayname,
            roles: Roles,
        },
      });

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/modifyuser",
      headers: header,
      data: data,
    };

    axios(config)
      .then((response) => {
        getUsers()
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(id)
  }

 const getUsers=()=>{
   let config = {
     method: "post",
     url: process.env.REACT_APP_URL + "admin/getusers",
     headers: header,
     data: "",
   };

   axios(config)
     .then((response) => {
       setdata(response.data.users);
     })
     .catch((error) => {
       console.log(error);
     });
 }
  useEffect(() => {
    
 getUsers();
  }, [])
  const [columns, setcolumns] = useState([
    {
      title: "UserName",
      field: "userName",
    },
    {
      title: "DisplayName",
      field: "displayName",
    },
    {
      title: "Roles",
      field: "roles",
    },
    {
      title: "Update",
      render: (rowData) => (
        <Button 
        // onClick={()=>updateuser(rowData.userId)}
        >
          <EditIcon />
        </Button>
      ),
    },
  ]);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2} style={{ padding: 20 }} direction="column">
        <Grid item xs={12}>
          <Typography
            variant="h"
            className={classes.title}
            style={{ color: "#43B02A", fontSize: "30px" }}
          >
            Update Users
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper variant="outlined"></Paper>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.demo}>
            <List>
              <MaterialTable
               
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
                options={{
                  paging: false,
                  tableLayout: "fixed",
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
      </Grid>
    </div>
  );
}