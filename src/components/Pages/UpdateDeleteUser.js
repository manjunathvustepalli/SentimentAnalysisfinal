import React,{useEffect,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import { Paper, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { header } from './Auth';
import axios from 'axios'
import MaterialTable from "material-table";
import DeleteIcon from '@material-ui/icons/Delete';


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
  const [data,setdata]=useState([]);
  const [Username, setUsername] = useState();
  const [Displayname, setDisplayname] = useState();
  const [Roles, setRoles] = useState();

  const deleteuser=(id)=>{
   
    let data = JSON.stringify({ user: { userId: id } });

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/deleteuser",
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

  const [columns, setColumns] = useState([
    { title: 'Username', field: 'userName' },
    { title: 'Display name', field: 'displayName' },
    { title: 'Roles', field: 'roles' },
    {
      title: 'Login Status',
      field: 'loginStatus'
    },
    // {
    //   title: "Delete",
    //   render: (rowData) => (
    //     <Button onClick={()=>deleteuser(rowData.userId)}>
    //       <DeleteIcon />
    //     </Button>
    //   ),
    // },
  ]);

  // const [data, setData] = useState([
  //   { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
  //   { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
  // ]);

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

          onRowUpdate : (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                // const dataUpdate = [...data];
                // console.log("NEWDATAusername:", newData)
                // console.log("OLDDATAusername:", oldData)
                // console.log("Username:", newData.userName)
                // console.log("Dislayname:", newData.displayName)
                // console.log("Roles:", newData.roles)
                // console.log("Id:", newData.userId)
                setUsername(newData.userName)
                setDisplayname(newData.displayName)
                setRoles(newData.roles)
                updateuser(newData.userId)
                // dataUpdate[index] = newData;
                // setData([...dataUpdate]);
                resolve();
              }, 1000)
            }),

          onRowDelete: (oldData, newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                // const dataDelete = [...data];
                deleteuser(oldData.userId)
                // dataDelete.splice(index, 1);
                // setData([...dataDelete]);
                
                resolve()
              }, 1000)
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
      </Grid>
    </div>
  );
}

