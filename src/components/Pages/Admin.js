import {
  Button,
  capitalize,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import AdminTable from "../Tables/AdminTable";
import Loader from "../LoaderWithBackDrop";
import { Auth } from "./Auth";
import Cookies from "js-cookie";
import AddUser from "./AddUser";
import UpdateDeleteUser from "./UpdateDeleteUser";
import AddRole from "./AddRole";
import ChangeDeleteRole from "./changedeleterole";
import IconButton from "@material-ui/core/IconButton";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
const useStyles = makeStyles((theme) => ({
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
function Admin() {
  const sourcesQueryKeys = {
    facebook: "getaddedfbpages",
    instagram: "getaddedinstagrampages",
    blogger: "getaddedbloggerpages",
    telegram: "getaddedtelegramchannels",
    googlenews: "getaddedgooglenewspages",
    twitter: "getasynctwitterconfig",
    englishstopwords: "getenglishstopwords",
    banglishstopwords: "getbanglishstopwords",
    bengalistopwords: "getbengalistopwords",
  };
  const classes = useStyles();
  const [source, setSource] = useState("facebook");
  const [columns, setColumns] = useState([
    {
      title: "Pages",
      field: "name",
    },
  ]);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [newlyAddedWord, setNewlyAddedWord] = useState([]);
  const [newlyAddedWord1, setNewlyAddedWord1] = useState([]);
  const [deletedWord1, setDeletedWord1] = useState("");
  const [deletedWord, setDeletedWord] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loaderOpen, setLoaderOpen] = useState(true);
  const [pagedata, setpagedata] = useState([]);
  const [showadduser, setshowadduser] = useState(false);
  const [showaddrole, setshowaddrole] = useState(false);
  const [keyworddata, setkeyworddata] = useState([]);
  const [pages] = useState(JSON.parse(Cookies.get("pages")));
  const [usermanagementpage, setusermanagementpage] = useState(false);
  const [rolemanagementpage, setrolemanagementpage] = useState(false);
  const [adminmanagementpage, setadminmanagementpage] = useState(false);
  const [open, setOpen] = React.useState(false);
  const addnewkeyword = async (data) => {
    if (source === "twitter") {
      await setpagedata((oldArray) => [...oldArray, data]);
    }
    await setNewlyAddedWord(data);
  };
  useEffect(() => {
    pages.map((page) => {
      if (page === "Administration - Role Management") {
        setrolemanagementpage(true);
        setSource("Role");
      }
      if (page === "Administration - User Management") {
        setusermanagementpage(true);
        setSource("User");
      }
      if (page === "Administration - Source Type Management") {
        setadminmanagementpage(true);
        setSource("facebook");
      }
    });
  }, []);
  const deletekeyword = async (data) => {
    if (source === "twitter") {
      // await setpagedata((oldArray) => );
      await setpagedata((items) =>
        items.filter(function (item) {
          if (item !== data) {
            return item;
          }
        })
      );

      //   let pagedatas = await pagedata.filter(function (item) {
      //     if (item !== data) {
      //       return item;
      //     }
      //   });
      //   console.log(pagedatas);
      //  await setpagedata(pagedatas)
    }
    await setDeletedWord(data);
  };
  const addnewkeyword1 = async (data) => {
    if (source === "twitter") {
      await setkeyworddata((oldArray) => [...oldArray, data]);
    }
    await setNewlyAddedWord1(data);
  };
  const deletekeyword1 = async (data) => {
    if (source === "twitter") {
      await setkeyworddata((items) =>
        items.filter(function (item) {
          if (item !== data) {
            return item;
          }
        })
      );
    }
    await setDeletedWord1(data);
  };
  const getdata = () => {
    let token = Cookies.get("token");
    setLoaderOpen(true);
    // Axios.get(`${process.env.REACT_APP_TUNNEL_URL}${sourcesQueryKeys[source]}`, Auth)

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + `${sourcesQueryKeys[source]}`,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: "",
    };

    Axios(config)
      .then((data) => {
        if (source !== "twitter") {
          setData(
            data.data[Object.keys(data.data)[1]].map((item) => {
              return {
                name: item,
              };
            })
          );
        } else {
          setpagedata(data.data[Object.keys(data.data)[2]]);
          setkeyworddata(data.data[Object.keys(data.data)[1]]);
          if (data.data[Object.keys(data.data)[2]]) {
            setData(
              data.data[Object.keys(data.data)[2]].map((item) => {
                return {
                  name: item,
                };
              })
            );
          } else {
            setData([]);
            setpagedata([]);
          }
          if (data.data[Object.keys(data.data)[1]]) {
            setData1(
              data.data[Object.keys(data.data)[1]].map((item) => {
                return {
                  name: item,
                };
              })

            );
            
          } else {
            setData1([]);
            setkeyworddata([]);
          }
        }
        setLoaderOpen(false);
      })
      .catch((err) => {
        setLoaderOpen(false);
        console.log(err, err.response);
      });
  };
  useEffect(() => {
    if (
      source === "twitter" ||
      source === "facebook" ||
      source === "instagram"||
      source === "englishstopwords"||
      source === "banglishstopwords"||
      source === "bengalistopwords"
    ) {
      getdata();
    }
  }, [source, refresh]);

  useEffect(() => {
    let token = Cookies.get("token");

    setLoaderOpen(true);

    if (newlyAddedWord.length !== 0 || newlyAddedWord1.length !== 0) {
      const sourceAddQueryStrings = {
        facebook: "startcrawlingfbpage",
        instagram: "startcrawlinginstagrampage",
        blogger: "startcrawlingbloggerpage",
        telegram: "startcrawlingtelegramchannel",
        googlenews: "startcrawlinggooglenewspage",
        twitter: "setasynctwitterconfig",
        banglishstopwords: "addbanglishstopword",
        englishstopwords: "addenglishstopword",
        bengalistopwords: "addbengalistopword",
      };
      //   Axios.get(
      //     `${process.env.REACT_APP_TUNNEL_URL}${sourceAddQueryStrings[source]}${newlyAddedWord}`,
      //     Auth
      //   )
      let jsondata = "";
      if (source === "facebook") {
        jsondata = JSON.stringify({ fbpages: [newlyAddedWord] });
      } else if (source === "instagram") {
        jsondata = JSON.stringify({ instapages: [newlyAddedWord] });
      } else if (source === "blogger") {
        jsondata = JSON.stringify({ bloggerpages: [newlyAddedWord] });
      } else if (source === "telegram") {
        jsondata = JSON.stringify({ telegramchannels: [newlyAddedWord] });
      } else if (source === "twitter") {
        jsondata = JSON.stringify({
          keywords: keyworddata,
          handles: pagedata,
        });
      } else if (source === "englishstopwords") {
        jsondata = JSON.stringify({ englishStopWords: [newlyAddedWord] });
      
      } else if (source === "banglishstopwords") {
        jsondata = JSON.stringify({ banglishStopWords: [newlyAddedWord] });
      
      } else if (source === "bengalistopwords") {
        jsondata = JSON.stringify({ bengaliStopWords: [newlyAddedWord] });
      }
      else {
        jsondata = JSON.stringify({ googlenewspages: [newlyAddedWord] });
      }

      let config = {
        method: "post",
        url: process.env.REACT_APP_URL + `${sourceAddQueryStrings[source]}`,
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        data: jsondata,
      };

      Axios(config)
        .then((data) => {
          setRefresh((prev) => !prev);
          setLoaderOpen(false);
          //      setNewlyAddedWord1("");
          //      setNewlyAddedWord("");
        })
        .catch((err) => {
          setRefresh((prev) => !prev);
          setLoaderOpen(false);
          console.log(err, err.response);
        });
    } else {
      setLoaderOpen(false);
    }
  }, [newlyAddedWord, newlyAddedWord1]);

  useEffect(() => {
    let token = Cookies.get("token");
    setLoaderOpen(true);
    if (deletedWord || deletedWord1) {
      const sourceDeleteQueryStrings = {
        facebook: "stopcrawlingfbpage",
        instagram: "stopcrawlinginstagrampage",
        blogger: "stopcrawlingbloggerpage",
        telegram: "stopcrawlingtelegramchannel",
        googlenews: "stopcrawlinggooglenewspage",
        twitter: "setasynctwitterconfig",
        englishstopwords: "deleteenglishstopword",
        banglishstopwords: "deletebanglishstopword",
        bengalistopwords: "deletebengalistopword",
      };
      //   Axios.get(
      //     `${process.env.REACT_APP_TUNNEL_URL}${sourceDeleteQueryStrings[source]}${deletedWord}`,
      //     Auth
      //   )
      let data = "";
      if (source === "facebook") {
        data = JSON.stringify({ fbpages: [deletedWord] });
      } else if (source === "instagram") {
        data = JSON.stringify({ instapages: [deletedWord] });
      } else if (source === "blogger") {
        data = JSON.stringify({ bloggerpages: [deletedWord] });
      } else if (source === "telegram") {
        data = JSON.stringify({ telegramchannels: [deletedWord] });
      } else if (source === "twitter") {
        data = JSON.stringify({
          keywords: keyworddata,
          handles: pagedata,
        });
      }
      else if (source === "englishstopwords") {
        data = JSON.stringify({ englishStopWords: [deletedWord] });
      
      } else if (source === "banglishstopwords") {
        data = JSON.stringify({ banglishStopWords: [deletedWord] });
      
      } else if (source === "bengalistopwords") {
        data = JSON.stringify({ bengaliStopWords: [deletedWord] });
      }
      else {
        data = JSON.stringify({ googlenewspages: [deletedWord] });
      }

      let config = {
        method: "post",
        url: process.env.REACT_APP_URL + `${sourceDeleteQueryStrings[source]}`,
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        data: data,
      };

      Axios(config)
        .then((data) => {
          console.log(data);
          setLoaderOpen(false);
          setRefresh((prev) => !prev);
        })
        .catch((err) => {
          setLoaderOpen(false);
          console.log(err, err.response);
        });
    }
  }, [deletedWord, deletedWord1]);
  const handleuser = (e) => {
    setshowadduser((showadduser) => !showadduser);
  };
  const handlerole = (e) => {
    setshowaddrole((v) => !v);
  };
  const handlefileupload = (e) => {
    setOpen(!open);
    let token = Cookies.get("token");
    console.log(e.target.files[0]);
    let data = new FormData();
    if(source=="facebook"){
      data.append("fbpagesfile", e.target.files[0]);
    }else if(source=="banglishstopwords"){
      data.append("banglishstopwordsfile", e.target.files[0]);
    }
    else if(source=="bengalistopwords"){
      data.append("bengalistopwordsfile", e.target.files[0]);
    }
    else if(source=="englishstopwords"){
      data.append("englishstopwordsfile", e.target.files[0]);
    }

    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/bulkupload",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    Axios(config)
      .then((response) => {
        if (response.status === 200) {
          getdata();
          setOpen(false);
          document.getElementById("myInput").value = "";
        } else {
          setOpen(false);
        }

        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        setOpen(false);
        console.log(error);
      });
  };
  return (
    <>
      <div style={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item xs={false} sm={3} />
          <Grid item xs={10} sm={6}>
            {adminmanagementpage ? (
              <>
                <Backdrop className={classes.backdrop} open={open}>
                  <CircularProgress color="inherit" />
                </Backdrop>
                <FormControl
                  variant="outlined"
                  style={{ width: "100%", marginTop: "30px" }}
                >
                  <InputLabel id={"select-source"}> Select Source </InputLabel>
                  <Select
                    labelId="select-source"
                    value={source}
                    label={"Select Source"}
                    onChange={(e) => {
                      setSource(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value={"facebook"}> {"Facebook"} </MenuItem>
                    <MenuItem value={"instagram"}> {"Instagram"} </MenuItem>
                    {/* <MenuItem value={"telegram"}> {"Telegram"} </MenuItem> */}
                    {/* <MenuItem value={"googlenews"}> {"Google News"} </MenuItem> */}
                    <MenuItem value={"twitter"}> {"Twitter"} </MenuItem>
                    <Divider variant="middle" />

                    {usermanagementpage ? (
                      <MenuItem value={"User"}> {"User"} </MenuItem>
                    ) : null}

                    {rolemanagementpage ? (
                      <MenuItem value={"Role"}> {"Role"} </MenuItem>
                      ) : null}
                      <MenuItem value={"banglishstopwords"}> {" Banglish Stop Words Management"} </MenuItem>
                      <MenuItem value={"bengalistopwords"}> {"Bengali Stop Words Management"} </MenuItem>
                      <MenuItem value={"englishstopwords"}> {"English Stop Words Management"} </MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <FormControl
                  variant="outlined"
                  style={{ width: "100%", marginTop: "30px" }}
                >
                  <InputLabel id={"select-source"}> Select Source </InputLabel>
                  <Select
                    labelId="select-source"
                    value={source}
                    label={"Select Source"}
                    onChange={(e) => {
                      setSource(e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    {usermanagementpage ? (
                      <MenuItem value={"User"}> {"User"} </MenuItem>
                    ) : null}

                    {rolemanagementpage ? (
                      <MenuItem value={"Role"}> {"Role"} </MenuItem>
                    ) : null}
                  </Select>
                </FormControl>
              </>
            )}
          </Grid>
          <Grid item xs={false} sm={3} />
          <Grid item xs={1} />
          <Grid item xs={10}>
            {source === "facebook" ||
            source === "instagram" ||
            source === "twitter"   ||
            source=="banglishstopwords" ||
            source=="englishstopwords"   ||
            source=="bengalistopwords"
             ? (
              <>
                {source === "facebook" ||
                source=="banglishstopwords" ||
                source=="englishstopwords"   ||
                source=="bengalistopwords"
                ? (
                  <>
                    <Grid
                      container
                      direction="column"
                      justify="flex-start"
                      alignItems="flex-end"
                    >
                      <Button
                        variant="contained"
                        component="label"
                        style={{
                          backgroundColor: "rgb(67, 176, 42)",
                          color: "white",
                        }}
                      >
                        Upload File
                        <input
                          type="file"
                          hidden
                          onChange={handlefileupload}
                          id="myInput"
                        />
                      </Button>
                    </Grid>
                  </>
                ) : null}
                <AdminTable
                  name={`${capitalize(source)} Pages `}
                  data={data}
                  source={source}
                  loaderOpen={loaderOpen}
                  columns={columns}
                  setNewlyAddedWord={addnewkeyword}
                  setDeletedWord={deletekeyword}
                />
              </>
            ) : null}
            {source === "twitter" ? (
              <AdminTable
                name={`${capitalize(source)} Keywords`}
                data={data1}
                source={source}
                loaderOpen={loaderOpen}
                columns={columns}
                setNewlyAddedWord={addnewkeyword1}
                setDeletedWord={deletekeyword1}
              />
            ) : null}
            {source === "User" ? (
              <>
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-end"
                >
                  {showadduser ? (
                    <IconButton
                      fontSize="large"
                      onClick={(e) => {
                        handleuser(e);
                      }}
                    >
                      <CancelOutlinedIcon />
                    </IconButton>
                  ) : (
                    <Button
                      style={{
                        backgroundColor: "rgb(67, 176, 42)",
                        color: "white",
                      }}
                      onClick={(e) => {
                        handleuser(e);
                      }}
                    >
                      Add User
                    </Button>
                  )}
                </Grid>

                {showadduser ? <AddUser /> : <UpdateDeleteUser />}
              </>
            ) : null}
            {source === "Role" ? (
              <>
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-end"
                >
                  {showaddrole ? (
                    <IconButton
                      fontSize="large"
                      onClick={(e) => {
                        handlerole(e);
                      }}
                    >
                      <CancelOutlinedIcon />
                    </IconButton>
                  ) : (
                    <Button
                      style={{
                        backgroundColor: "rgb(67, 176, 42)",
                        color: "white",
                      }}
                      onClick={(e) => {
                        handlerole(e);
                      }}
                    >
                      Add Role
                    </Button>
                  )}
                </Grid>
                {showaddrole ? <AddRole /> : <ChangeDeleteRole />}
              </>
            ) : null}
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </div>
    </>
  );
}

export default Admin;
