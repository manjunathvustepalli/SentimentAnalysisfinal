import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import SideNav from '../Navigation/SideNav'
import { Grid } from '@material-ui/core';
import SearchBar from "material-ui-search-bar";

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

    const [value, setValue] = useState('')
    const tileData = [
        {
          img: require('../../imgs/pic1.jpg'),
          title: 'Image',
          author: 'author',
        },
        {
            img: require('../../imgs/pic2.jpg'),
            title: 'Image',
            author: 'author',
          },
          {
            img: require('../../imgs/pic3.jpg'),
            title: 'Image',
            author: 'author',
          },
          {
            img: require('../../imgs/pic4.jpg'),
            title: 'Image',
            author: 'author',
          },
          {
            img: require('../../imgs/pic5.jpg'),
            title: 'Image',
            author: 'author',
          },
      ];
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <SideNav>
            <Grid container>
                <Grid item xs={2} />
                <Grid item xs={8} style={{marginTop:'30px'}}>
                    <SearchBar
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                    />
                </Grid>
                <Grid item xs={2} />
            </Grid>
            <GridList style={{padding:'40px'}}  cellHeight={300} className={classes.gridList}>
            <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">Search Results</ListSubheader>
            </GridListTile>
            {tileData.map((tile) => (
            <GridListTile cols={1} key={tile.img} style ={{padding:'10px'}}>
                <img src={tile.img} alt={tile.title} />
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
        </SideNav>
    </div>
  );
}