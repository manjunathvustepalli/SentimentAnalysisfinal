import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {Divider, Paper} from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
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

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

export default function InteractiveList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>

      <Grid container spacing={2} style={{padding: 20}}  direction='column'>
          <Grid item xs={12}>
          <Typography variant="h" className={classes.title} style={{ color: "#43B02A", fontSize: "30px" }}>
            Delete Users
          </Typography>
          </Grid>
          <Grid item xs={12}>
              <Paper variant='outlined'>

              </Paper>
          </Grid>
        <Grid item xs={12}>
          <div className={classes.demo}>
            <List>
              {generate(
                <>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Username"
                    secondary='User Role'
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size='large' aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider/>
                </>,
              )}
            </List>
          </div>
        </Grid>
      </Grid>
     </div>
  );
}