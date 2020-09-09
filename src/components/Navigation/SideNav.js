import './sidebar.css';
import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { Button, Tooltip } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import { green } from '@material-ui/core/colors'
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  listItemText:{
    fontSize:'16px',
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
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor:"white"
  },
  AvatarBox:{
      backgroundColor:green[800]
  },
  content: {
    flexGrow: 1,
  },
}));

const SideNavBar = ( props) => {
  const { window,children,history } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const currentTab = (history,path)=>{
    if(path.includes(history.location.pathname)){
        return {color:green[800]}
    }
    else{
        return {color:"black"}
    }
}
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const menus=[
    {
      name:'Summary Dashboard',
      icon:<BallotIcon/>,
      path:['/summary-dashboard'],
    }, 
    {
      name:'Sentimental Analysis',
      icon:<SentimentVerySatisfiedIcon/>,
      path:['/sentimental-analysis/area-chart','/sentimental-analysis/pie-chart','/sentimental-analysis/line-chart','/sentimental-analysis/semi-donut-chart','/sentimental-analysis/bar-chart'],
    },
    // {
    //   name:'Mood Analysis',
    //   icon:<ChildCareIcon/>,
    //   path:['/mood-analysis/area-chart','/mood-analysis/pie-chart','/mood-analysis/line-chart'],
    // },
    {
      name:'Influencer Analysis',
      icon:<EmojiPeopleIcon/>,
      path:['/influencer-analysis'],
    },
    {
      name:'Geo HotSpot Analysis',
      icon:<PublicIcon/>,
      path:['/geo-hotspot'],
    },
    {
      name:'Word cloud',
      icon:<AppsIcon/>,
      path:['/word-cloud/sentiment'/*,'/word-cloud/mood'*/],
    },
    {
      name:'Trending Subject',
      icon:<TrendingUpIcon/>,
      path:['/trending-subject/sentiment','/trending-subject/mood'],
    },
    {
      name:'Trend Analysis',
      icon:<WhatshotIcon/>,
      path:['/trend-analysis'],
    },
    {
      name:'Demography',
      icon:<DeviceHubIcon/>,
      path:['/demography'],
    },    
    {
      name:'Behavior Analysis',
      icon:<HdrWeakIcon/>,
      path:['/behavior-analysis'],
    },    
    {
      name:'Live Analysis',
      icon:<CalendarViewDayIcon/>,
      path:['/Live-analysis'],
    },
    {
      name:'Export Data',
      icon:<MoveToInboxIcon/>,
      path:['/export-data'],
    },
    {
      name:'Admin Page',
      icon:<PermDataSettingIcon/>,
      path:['/admin'],
    },
    {
      name:'Search Image',
      icon:<ImageSearchIcon/>,
      path:['/image-gallery'],
    },
  ]
    
   const drawer = (
    <div>
          <div id="userMenuHeader">
            <Grid container justify='space-around' flexDirection='row' >
              <Grid xs={12}>
              <Avatar alt="karthik" id="userAvatar"  src={require('../../imgs/user.jpg')} />
              </Grid>
              <Grid item align="left" className='grid-user' xs={10} >
                <Typography > Welcome User</Typography>
              </Grid>
              <Grid item align="right" className='grid-user' xs={2}>
                <Typography align="right"><ArrowDropDownIcon/></Typography>
              </Grid>
            </Grid>
          </div>
      <Divider />
      <List>
        {menus.map((menuItem, index) => (
          <Link to={menuItem.path[0]} key={index} style={{textDecoration:'none',color:'black'}}>
            <ListItem  button key={index}>
              <ListItemIcon style={currentTab(history,menuItem.path)}> {menuItem.icon} </ListItemIcon>
              <ListItemText style={currentTab(history,menuItem.path)} classes={{primary:classes.listItemText}} primary={menuItem.name} />
            </ListItem>
            <Divider/>      
          </Link> 
        ))}
      </List>
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
          <Avatar src={require('../../imgs/shyna.jpeg')} />
          <Typography variant="h6" noWrap>
            &nbsp; Social Media Sentiment Analysis
          </Typography>
          <span style={{marginLeft:'auto'}}>
          <Tooltip title={'Logout'}>
          <Button color="inherit" >
            <ExitToAppIcon/>
          </Button>
          </Tooltip>
          </span>
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
              keepMounted: true,
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


export default withRouter(SideNavBar);