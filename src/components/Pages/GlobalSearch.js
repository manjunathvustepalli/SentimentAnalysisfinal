import { Button, capitalize, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Select, Slide, } from '@material-ui/core';
import React, { useState } from 'react'
import ChipInput from 'material-ui-chip-input';
import Axios from 'axios';
import MaterialTable from 'material-table';
import Loader from '../LoaderWithBackDrop'
import LaunchIcon from '@material-ui/icons/Launch';
import Image from 'material-ui-image'
import Cookies from "js-cookie";
const dateFormatter = (unix) => {
    var date = new Date(unix);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var month = date.getMonth()+1
    var year = date.getFullYear()
    var todayDate = date.getDate()
    return  todayDate+'/'+month+'/'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

function GlobalSearch() {
    const [source, setSource] = useState('twitter');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [handles, setHandles] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [open, setopen] = useState(false)
    const [imageUrl, setImageUrl] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const submitData = () => {
        let token=Cookies.get("token")
        setopen(true)
        let keywordsString = keywords.join(',')
        let handlesString = handles.join(',')
        let temp = []
        if(source === 'twitter'){
            // Axios.post(
            //   `${process.env.REACT_APP_URL}/fetchdatafromtwitter?keywords=${keywordsString}&handles=${handlesString}`
            // )
            let data = JSON.stringify({
              keywords: [keywordsString],
              handles: [handlesString],
            });

            let config = {
              method: "post",
              url:
                process.env.REACT_APP_URL+"fetchdatafromtwitter",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              data: data,
            };

            Axios(config)
              .then((res) => {
                console.log(res);
                if (res.data.status === "Success") {
                  let query = {
                    query: {
                      bool: {
                        must: [{ terms: { "Source.keyword": [source] } }],
                      },
                    },
                    size: 50,
                    sort: [
                      {
                        CreatedAt: {
                          order: "desc",
                        },
                      },
                    ],
                  };
                  if (handles.length) {
                    query.query.bool.must.push({
                      terms: {
                        "User.ScreenName.keyword": handles,
                      },
                    });
                  }
                  if (keywords.length) {
                    query.query.bool.must.push({
                      terms: {
                        "HashtagEntities.Text.keyword": keywords,
                      },
                    });
                  }
                  Axios.post(process.env.REACT_APP_SEARCH_URL, query)
                    .then((data) => {
                      console.log(data);
                      setData(
                        data.data.hits.hits.map((postObj) => {
                          if (!postObj._source.User) {
                            return {
                              date: dateFormatter(postObj._source.CreatedAt),
                              post: postObj._source.Text,
                              favouriteCount: postObj._source.FavoriteCount,
                              sentiment: postObj._source.predictedSentiment,
                              mood: postObj._source.predictedMood,
                              language: postObj._source.predictedLang,
                            };
                          } else {
                            return {
                              date: dateFormatter(postObj._source.CreatedAt),
                              post: postObj._source.Text,
                              favouriteCount: postObj._source.FavoriteCount,
                              sentiment: postObj._source.predictedSentiment,
                              mood: postObj._source.predictedMood,
                              language: postObj._source.predictedLang,
                              followersCount:
                                postObj._source.User.FollowersCount,
                              location: postObj._source.User.Location,
                              name: postObj._source.User.Name,
                              screenName: postObj._source.User.ScreenName,
                            };
                          }
                        })
                      );
                      setColumns([
                        {
                          title: "Date",
                          field: "date",
                        },
                        {
                          title: "Name",
                          field: "name",
                        },
                        {
                          title: "Screen Name",
                          field: "screenName",
                        },
                        {
                          title: "Post",
                          field: "post",
                        },
                        {
                          title: "Followers Count",
                          field: "followersCount",
                        },
                        {
                          title: "Location",
                          field: "location",
                        },
                        {
                          title: "Sentiment",
                          field: "sentiment",
                        },
                        // {
                        //     title:'Mood',
                        //     field:'mood',
                        // },
                        {
                          title: "Language",
                          field: "language",
                        },
                      ]);
                      setopen(false);
                    })
                    .catch((err) => {
                      console.log(err);
                      setopen(false);
                    });
                }
              })
              .catch((err) => {
                console.log(err, err.response);
                setopen(false);
              });
        } else if(source === 'facebook') {
            // Axios.post(`${process.env.REACT_APP_URL}/fetchdatafromfb?fbpage=${handlesString}`)
            let data = JSON.stringify({ fbpage: handlesString });

            let config = {
              method: "post",
              url:
                process.env.REACT_APP_URL+"startcrawlingfbpage",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              data: data,
            };

            Axios(config)
              .then((res) => {
                let query = {
                  query: {
                    bool: {
                      must: [{ terms: { "Source.keyword": [source] } }],
                    },
                  },
                  size: 50,
                  sort: [
                    {
                      CreatedAt: {
                        order: "desc",
                      },
                    },
                  ],
                };
                if (handles.length) {
                  query.query.bool.must.push({
                    terms: {
                      "SubSource.keyword": handles,
                    },
                  });
                }
                if (keywords.length) {
                  query.query.bool.must.push({
                    terms: {
                      "HashtagEntities.Text.keyword": keywords,
                    },
                  });
                }
                setTimeout(() => {
                  Axios.post(process.env.REACT_APP_SEARCH_URL, query)
                    .then((data) => {
                      setData(
                        data.data.hits.hits.map((postObj, i) => {
                          return {
                            date: dateFormatter(postObj._source.CreatedAt),
                            post: postObj._source.Text,
                            favouriteCount: postObj._source.FavoriteCount,
                            sentiment: postObj._source.predictedSentiment,
                            mood: postObj._source.predictedMood,
                            language: postObj._source.predictedLang,
                            screenName: postObj._source.SubSource,
                          };
                        })
                      );
                      setColumns([
                        {
                          title: "Date",
                          field: "date",
                        },
                        {
                          title: "Screen Name",
                          field: "screenName",
                        },
                        {
                          title: "Post",
                          field: "post",
                        },
                        {
                          title: "Sentiment",
                          field: "sentiment",
                        },
                        // {
                        //     title:'Mood',
                        //     field:'mood',
                        // },
                        {
                          title: "Language",
                          field: "language",
                        },
                      ]);
                      setopen(false);
                    })
                    .catch((err) => {
                      console.log(err);
                      setopen(false);
                    });
                }, 10000);
              })
              .catch((err) => {
                console.log(err);
                setopen(false);
              });
        } else if(source === 'instagram'){
            // Axios.post(`${process.env.REACT_APP_URL}/fetchdatafrominstagram?instapage=${handlesString}&keywords=${keywordsString}`)
            let data = JSON.stringify({ instapage: handlesString });

            let config = {
              method: "post",
              url:
                process.env.REACT_APP_URL+"startcrawlinginstagrampage",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              data: data,
            };

            Axios(config).then((res) => {
              console.log(res);
              if (res.data.status === "ACCEPTED") {
                let query = {
                  query: {
                    bool: {
                      must: [{ terms: { "Source.keyword": [source] } }],
                    },
                  },
                  size: 50,
                  sort: [
                    {
                      CreatedAt: {
                        order: "desc",
                      },
                    },
                  ],
                };
                if (handles.length) {
                  query.query.bool.must.push({
                    terms: {
                      "SubSource.keyword": handles,
                    },
                  });
                }
                if (keywords.length) {
                  query.query.bool.must.push({
                    terms: {
                      "HashtagEntities.Text.keyword": keywords,
                    },
                  });
                }

                Axios.post(process.env.REACT_APP_SEARCH_URL, query).then(
                  (data) => {
                    console.log(data.data.hits.hits);
                    setData(
                      data.data.hits.hits.map((postObj, i) => {
                        if (
                          postObj._source.MediaEntities &&
                          postObj._source.MediaEntities.length
                        ) {
                          return {
                            date: dateFormatter(postObj._source.CreatedAt),
                            post: postObj._source.Text,
                            favouriteCount: postObj._source.FavoriteCount,
                            sentiment: postObj._source.predictedSentiment,
                            mood: postObj._source.predictedMood,
                            language: postObj._source.predictedLang,
                            screenName: postObj._source.SubSource,
                            image: postObj._source.MediaEntities.map(
                              (image) => {
                                if (!image.MediaURL) {
                                  return <span />;
                                }
                                return (
                                  <IconButton
                                    onClick={() => {
                                      setImageUrl(image.MediaURL);
                                      setDialogOpen(true);
                                    }}
                                    style={{
                                      backgroundColor: "rgb(67, 176, 42)",
                                      color: "white",
                                    }}
                                  >
                                    <LaunchIcon />
                                  </IconButton>
                                );
                              }
                            ),
                          };
                        } else {
                          return {
                            date: dateFormatter(postObj._source.CreatedAt),
                            post: postObj._source.Text,
                            favouriteCount: postObj._source.FavoriteCount,
                            sentiment: postObj._source.predictedSentiment,
                            mood: postObj._source.predictedMood,
                            language: postObj._source.predictedLang,
                            screenName: postObj._source.SubSource,
                          };
                        }
                      })
                    );
                    setColumns([
                      {
                        title: "Date",
                        field: "date",
                      },
                      {
                        title: "Screen Name",
                        field: "screenName",
                      },
                      {
                        title: "Post",
                        field: "post",
                      },
                      {
                        title: "Sentiment",
                        field: "sentiment",
                      },
                      // {
                      //     title:'Mood',
                      //     field:'mood',
                      // },
                      {
                        title: "Language",
                        field: "language",
                      },
                      {
                        title: "Media Urls",
                        field: "image",
                      },
                    ]);
                    setopen(false);
                  }
                );
              }
            });
        } else if(source === 'telegram') {
            // Axios.post(`${process.env.REACT_APP_URL}/fetchdatafromtelegramchannel?telegramchannel=${handlesString}&keywords=${keywordsString}`)
            let data = JSON.stringify({ telegramchannel: handlesString });

            let config = {
              method: "post",
              url:
                process.env.REACT_APP_URL+"startcrawlingtelegramchannel",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              data: data,
            };

            Axios(config).then((res) => {
              console.log(res);
              if (res.data.status === "ACCEPTED") {
                let query = {
                  query: {
                    bool: {
                      must: [{ terms: { "Source.keyword": [source] } }],
                    },
                  },
                  size: 50,
                  sort: [
                    {
                      CreatedAt: {
                        order: "desc",
                      },
                    },
                  ],
                };
                if (handles.length) {
                  query.query.bool.must.push({
                    terms: {
                      "SubSource.keyword": handles,
                    },
                  });
                }
                if (keywords.length) {
                  query.query.bool.must.push({
                    terms: {
                      "HashtagEntities.Text.keyword": keywords,
                    },
                  });
                }

                Axios.post(process.env.REACT_APP_SEARCH_URL, query).then(
                  (data) => {
                    console.log(data);
                    setData(
                      data.data.hits.hits.map((postObj, i) => {
                        return {
                          date: dateFormatter(postObj._source.CreatedAt),
                          post: postObj._source.Text,
                          favouriteCount: postObj._source.FavoriteCount,
                          sentiment: postObj._source.predictedSentiment,
                          mood: postObj._source.predictedMood,
                          language: postObj._source.predictedLang,
                          screenName: postObj._source.SubSource,
                        };
                      })
                    );
                    setColumns([
                      {
                        title: "Date",
                        field: "date",
                      },
                      {
                        title: "Screen Name",
                        field: "screenName",
                      },
                      {
                        title: "Post",
                        field: "post",
                      },
                      {
                        title: "Sentiment",
                        field: "sentiment",
                      },
                      // {
                      //     title:'Mood',
                      //     field:'mood',
                      // },
                      {
                        title: "Language",
                        field: "language",
                      },
                    ]);
                    setopen(false);
                  }
                );
              }
            });
        } else if(source === 'blogger'){
            // Axios.post(`${process.env.REACT_APP_URL}/fetchdatafromblogger?bloggerpage=${handlesString}&keywords=${keywordsString}`)
            let data = JSON.stringify({
              bloggerpage: handlesString,
            });

            let config = {
              method: "post",
              url:
                process.env.REACT_APP_URL+"startcrawlingbloggerpage",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              data: data,
            };

            Axios(config).then((res) => {
              console.log(res);
              if (res.data.status === "ACCEPTED") {
                let query = {
                  query: {
                    bool: {
                      must: [{ terms: { "Source.keyword": [source] } }],
                    },
                  },
                  size: 50,
                  sort: [
                    {
                      CreatedAt: {
                        order: "desc",
                      },
                    },
                  ],
                };
                if (handles.length) {
                  query.query.bool.must.push({
                    terms: {
                      "SubSource.keyword": handles,
                    },
                  });
                }
                if (keywords.length) {
                  query.query.bool.must.push({
                    terms: {
                      "HashtagEntities.Text.keyword": keywords,
                    },
                  });
                }

                Axios.post(process.env.REACT_APP_SEARCH_URL, query).then(
                  (data) => {
                    console.log(data);
                    setData(
                      data.data.hits.hits.map((postObj, i) => {
                        return {
                          date: dateFormatter(postObj._source.CreatedAt),
                          post: postObj._source.Text,
                          favouriteCount: postObj._source.FavoriteCount,
                          sentiment: postObj._source.predictedSentiment,
                          mood: postObj._source.predictedMood,
                          language: postObj._source.predictedLang,
                          screenName: postObj._source.SubSource,
                        };
                      })
                    );
                    setColumns([
                      {
                        title: "Date",
                        field: "date",
                      },
                      {
                        title: "Screen Name",
                        field: "screenName",
                      },
                      {
                        title: "Post",
                        field: "post",
                      },
                      {
                        title: "Sentiment",
                        field: "sentiment",
                      },
                      // {
                      //     title:'Mood',
                      //     field:'mood',
                      // },
                      {
                        title: "Language",
                        field: "language",
                      },
                    ]);
                    setopen(false);
                  }
                );
              }
            });
        } else if(source === 'google news'){
            // Axios.post(`${process.env.REACT_APP_URL}/fetchdatafromgooglenews?googlenewspage=${handlesString}&keywords=${keywordsString}`)
            let data = JSON.stringify({ googlenewspage: handlesString });

            let config = {
              method: "post",
              url:
                process.env.REACT_APP_URL+"startcrawlinggooglenewspage",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              data: data,
            };

            Axios(config).then((res) => {
              console.log(res);
              if (res.data.status === "ACCEPTED") {
                let query = {
                  query: {
                    bool: {
                      must: [{ terms: { "Source.keyword": ["googlenews"] } }],
                    },
                  },
                  size: 50,
                  sort: [
                    {
                      CreatedAt: {
                        order: "desc",
                      },
                    },
                  ],
                };
                if (handles.length) {
                  query.query.bool.must.push({
                    terms: {
                      "SubSource.keyword": handles,
                    },
                  });
                }
                if (keywords.length) {
                  query.query.bool.must.push({
                    terms: {
                      "HashtagEntities.Text.keyword": keywords,
                    },
                  });
                }

                Axios.post(process.env.REACT_APP_SEARCH_URL, query).then(
                  (data) => {
                    console.log(data);
                    setData(
                      data.data.hits.hits.map((postObj, i) => {
                        return {
                          date: dateFormatter(postObj._source.CreatedAt),
                          post: postObj._source.Text,
                          favouriteCount: postObj._source.FavoriteCount,
                          sentiment: postObj._source.predictedSentiment,
                          mood: postObj._source.predictedMood,
                          language: postObj._source.predictedLang,
                          screenName: postObj._source.SubSource,
                        };
                      })
                    );
                    setColumns([
                      {
                        title: "Date",
                        field: "date",
                      },
                      {
                        title: "Screen Name",
                        field: "screenName",
                      },
                      {
                        title: "Post",
                        field: "post",
                      },
                      {
                        title: "Sentiment",
                        field: "sentiment",
                      },
                      // {
                      //     title:'Mood',
                      //     field:'mood',
                      // },
                      {
                        title: "Language",
                        field: "language",
                      },
                    ]);
                    setopen(false);
                  }
                );
              }
            });
        }
    }

    const useStyles = makeStyles((theme) => ({
        root: {
          background: 'rgb(67, 176, 42)',
          color: 'white',
          height: 'auto',
          margin:'10px',
          fontSize:'10px',
          padding: '10px',
          '&:hover': {
            background: 'rgb(67, 176, 42)',
            color: 'white',
            height: 'auto',
            margin:'10px',
            fontSize:'10px',
            padding: '10px',
          }
        },
      }));

      const classes = useStyles()

    return (
        <>
            <Grid container spacing={1}style={{padding:'30px',position:'relative',height:'90vh'}}>
            <Loader open={open}  style={{position:'absolute'}} />
                <Grid item sm={12} md={3}>
                    <FormControl style={{width:'100%'}} variant="outlined" >

                        <InputLabel id="source-select-label" >Select Source</InputLabel>
                        <Select
                            labelId="source-select-label"
                            id="source-select"
                            value={source}
                            onChange={(e) =>{
                                    setData([])
                                    setSource(e.target.value)
                                    setKeywords([])
                                    setHandles([])
                            }}
                            label={'Select Source'}
                        >
                            {
                            ['facebook','twitter','instagram','telegram','blogger','google news'].map((source,i) => <MenuItem value={source} key={i} > {capitalize(source)} </MenuItem> )
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm={12} md={3}>
                        <ChipInput 
                        fullWidth
                        variant="outlined"
                        blurBehavior="add"
                        label={`Type ${source} Handle`}
                        value={handles}
                        onAdd={(chip) =>{
                            setHandles(prev => [...prev,chip])
                        }}
                        onDelete={(chip,i) =>{
                            setHandles(prev => {
                                let data = [...prev]
                                data.splice(i,1)
                                return data
                            })
                        }}
                    />
                </Grid>
                <Grid item sm={12} md={3} >
                        <ChipInput 
                        fullWidth
                        blurBehavior="add"
                        variant="outlined"
                        label="Type Keywords"
                        value={keywords}
                        onAdd={(chip) =>{
                            setKeywords(prev => {
                                let otherChip = ''
                                if(chip.startsWith('#')){
                                    otherChip = chip.slice(1,chip.length)
                                }else {
                                    otherChip = '#' + chip
                                }
                                return [...prev,otherChip,chip]
                            })
                        }}
                        onDelete={(chip,i) =>{
                            setKeywords(prev => {
                                let data = [...prev]
                                data.splice(i,1)
                                return data
                            })
                        }}
                    />
                </Grid>
            <Grid item  xs={12} md={2} >
                <Button style={{backgroundColor:'rgb(67, 176, 42)',color:'white',height:'50px'}} onClick={() => submitData()} fullWidth>
                    Search
                </Button>
            </Grid>
            <Grid item xs={12}>
                <div style={{width:'100%'}}>
                <MaterialTable
                style={{
                    padding:'20px'
                }}
                title='Search Results'
                columns={columns}
                data={data}
                options={{
                    paging:false,
                    tableLayout:"fixed",
                    maxBodyHeight:500,
                    headerStyle:{
                        backgroundColor:'rgb(67, 176, 42)',
                        color:'white',
                        paddingTop:'10px',
                        paddingBottom:'10px',
                    }
                }}
            />
                </div>
            </Grid>
        </Grid>
        <Dialog
                fullWidth
                style={{height:'700px'}}
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title"> Image </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
              <Image src={imageUrl} style={{width:'100%'}} />           
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  className={classes.root} onClick={() => setDialogOpen(false)} >
            Close
          </Button>
        </DialogActions>
        </Dialog>
        </>    
    )
}

export default GlobalSearch
