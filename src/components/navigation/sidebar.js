import React from 'react';
import {Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import BallotIcon from '@material-ui/icons/Ballot';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import PublicIcon from '@material-ui/icons/Public';
import AppsIcon from '@material-ui/icons/Apps';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import HdrWeakIcon from '@material-ui/icons/HdrWeak';

import './sidebar.scss';




const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
      
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor:"white"
    
  },
  AvatarBox:{
      backgroundColor:'green'
  },
  
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function ResponsiveDrawer(props,{history}) {
  const { window,children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const currentTab = (history,path)=>{
    if(path.includes(history.location.pathname)){
        return {color:"#2ecc72"}
    }
    else{
        return {color:"white"}
    }
}



  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const menus=[
    {
      name:'Summary Dashboard',
      icon:<BallotIcon/>,
      path:['/'],
    }, 
    {
      name:'Sentimental Analysis',
      icon:<SentimentVerySatisfiedIcon/>,
      path:['/sentimentalanalysis/areachart','/sentimentalanalysis/piechart'],
    },
    {
      name:'Mood Analysis',
      icon:<ChildCareIcon/>,
      path:['/moodanalysis/areachart'],
    },
    {
      name:'influencer Analysis',
      icon:<EmojiPeopleIcon/>,
      path:['/'],
    },
    {
      name:'Geo Hot Spot Analysis',
      icon:<PublicIcon/>,
      path:['/'],
    },
    {
      name:'Word cloud',
      icon:<AppsIcon/>,
      path:['/'],
    },
    {
      name:'Tranding Subject',
      icon:<TrendingUpIcon/>,
      path:['/'],
    },
    {
      name:'Trend Analysis',
      icon:<WhatshotIcon/>,
      path:['/'],
    },
    {
      name:'Demography',
      icon:<DeviceHubIcon/>,
      path:['/'],
    },    
    {
      name:'Behavior Analysis',
      icon:<HdrWeakIcon/>,
      path:['/'],
    },
  ]
    
   const drawer = (
    <div>
         <div className={classes.toolbar} id="userMenuHeader">
         <Avatar alt="karthik" src={require('../../imgs/k.JPG')} />
          <Grid container justify="space-between" className="grid-user">  
  <Typography inline variant="body1" align="left">Welcome User</Typography>
  <Typography inline variant="body1" align="right"><ArrowDropDownIcon/></Typography>
</Grid>
         </div>
      <Divider />
      <List>
      <ListItem button key="blank"><ListItemIcon></ListItemIcon><ListItemText primary="" /></ListItem>
        {menus.map((menuItem, index) => (
          <Link to={menuItem.path[0]} style={{textDecoration:'none',color:'black'}}>
            <ListItem button key={index}>
              <ListItemIcon> {menuItem.icon} </ListItemIcon>
              <ListItemText primary={menuItem.name} />
            </ListItem>
          </Link>       
        ))}
      </List>
      <Divider />
      
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Avatar alt="Remy Sharp" src="../../imgs/k.JPG" />
          <Typography variant="h6" noWrap>
          &nbsp; Amar Sarkar Sentiment Analysis
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
            {children}
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;