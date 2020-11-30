import {
  capitalize,
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
function Admin() {
  const sourcesQueryKeys = {
    facebook: "getaddedfbpages",
    instagram: "getaddedinstagrampages",
    blogger: "getaddedbloggerpages",
    telegram: "getaddedtelegramchannels",
    googlenews: "getaddedgooglenewspages",
    twitter: "getasynctwitterconfig",
  };
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
  const [keyworddata, setkeyworddata] = useState([]);
  const addnewkeyword = async (data) => {
    if (source === "twitter") {
      await setpagedata((oldArray) => [...oldArray, data]);
    }
    await setNewlyAddedWord(data);
  };
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
  useEffect(() => {
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
          setData(
            data.data[Object.keys(data.data)[2]].map((item) => {
              return {
                name: item,
              };
            })
          );
          setData1(
            data.data[Object.keys(data.data)[1]].map((item) => {
              return {
                name: item,
              };
            })
          );
        }
        setLoaderOpen(false);
      })
      .catch((err) => {
        setLoaderOpen(false);
        console.log(err, err.response);
      });
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
      } else {
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
      } else {
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

  return (
    <div style={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={false} sm={3} />
        <Grid item xs={10} sm={6}>
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
              <MenuItem value={"telegram"}> {"Telegram"} </MenuItem>
              <MenuItem value={"googlenews"}> {"Google News"} </MenuItem>
              <MenuItem value={"blogger"}> {"Blogger"} </MenuItem>
              <MenuItem value={"twitter"}> {"Twitter"} </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={false} sm={3} />
        <Grid item xs={1} />
        <Grid item xs={10}>
          <AdminTable
            name={`${capitalize(source)} Pages `}
            data={data}
            source={source}
            loaderOpen={loaderOpen}
            columns={columns}
            setNewlyAddedWord={addnewkeyword}
            setDeletedWord={deletekeyword}
          />
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
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </div>
  );
}

export default Admin;
