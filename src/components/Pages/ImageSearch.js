import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { Grid } from '@material-ui/core';
import Axios from 'axios';
import Image from 'material-ui-image'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));
 
export default function TitlebarGridList() {

  const [tilesData, setTilesData] = useState([])

  
useEffect(() =>{
  Axios.post(process.env.REACT_APP_SEARCH_URL,{
    "query": {
      "bool": {
        "must": [
          {
            "terms": {
              "Source.keyword": [
                'twitter'
              ]
            }
          }
        ]
      }
    },
    "size": 1000,
    "sort": [
      {
        "CreatedAt": {
          "order": "desc"
        }
      }
    ]
  })
  .then(fetchedData=>{
    var tileData = []
    fetchedData.data.hits.hits.forEach((post) => {
      if(post._source.User){
        var desc=""
        var name = post._source.User.Name
        var screenName = post._source.User.ScreenName
        desc = post._source.Text
      }
      if(post._source.MediaEntities && post._source.MediaEntities.length){
        post._source.MediaEntities.forEach((image)=>{
          if(image.MediaURLHttps){
            tileData.push({
              img: image.MediaURLHttps,
              title: desc,
              author: name + ' ( '+ screenName +' )',
            })
          } else if (image.MediaURL){
            tileData.push({
              img: image.MediaURL,
              title: desc,
              author: name + ' ( '+ screenName +' )',
            })
          }
        })
      }

    });
    setTilesData(tileData)
  })

},[])


    const [value, setValue] = useState('')
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <>
            {/* <Grid container>
                <Grid item xs={2} />
                <Grid item xs={8} style={{marginTop:'30px'}}>
                    <SearchBar
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                    />
                </Grid>
                <Grid item xs={2} />
            </Grid> */}
            <GridList style={{padding:'40px'}}  cellHeight={400} className={classes.gridList}>
            <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">Search Results</ListSubheader>
            </GridListTile>
            {tilesData.map((tile) => (
            <GridListTile cols={1} key={tile.img} style ={{padding:'10px'}}>
                <Image src={tile.img} alt={tile.title} />
                <GridListTileBar
                title={tile.title}
                subtitle={<span>by: {tile.author}</span>}
                actionIcon={
                    <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                    <InfoIcon />
                    </IconButton>
                }
                />
            </GridListTile>
            ))}
        </GridList>
        </>
    </div>
  );
}