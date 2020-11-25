import "./sidebar.css";
import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import BallotIcon from "@material-ui/icons/Ballot";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import ChildCareIcon from "@material-ui/icons/ChildCare";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import PublicIcon from "@material-ui/icons/Public";
import AppsIcon from "@material-ui/icons/Apps";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import HdrWeakIcon from "@material-ui/icons/HdrWeak";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import { Button, Tooltip } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PermDataSettingIcon from "@material-ui/icons/PermDataSetting";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import PageviewIcon from "@material-ui/icons/Pageview";
import StorageIcon from "@material-ui/icons/Storage";
import SearchIcon from "@material-ui/icons/Search";
import Cookies from "js-cookie";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DeleteIcon from '@material-ui/icons/Delete';
import LockIcon from '@material-ui/icons/Lock';
import UpdateIcon from '@material-ui/icons/Update';
import {header} from "../Pages/Auth";
import axios from "axios";
import { SentimentAnalysisContext } from "../../contexts/SentimentAnalysisContext";
import { TrendingSubjectContext } from "../../contexts/TrendingSubjectContext";
import { TrendAnalysisContext } from "../../contexts/TrendAnalysisContext";
import MoodAnalysisContext from "../../contexts/MoodAnalysisContext";
import { WordCloudContext } from "../../contexts/WordCloudContext";

const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  listItemText: {
    fontSize: "12px",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "white",
  },
  AvatarBox: {
    backgroundColor: "rgb(67,176,42)",
  },
  content: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
}));

const SideNavBar =  (props) => {
  const { window, children, history } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pages] = useState(JSON.parse(Cookies.get("pages")));
  const [token]=useState(Cookies.get("token"))
  const [isloading,setIsloading]=useState(true)
  const [name] = useState(Cookies.get("name"));
  const currentTab = (history, path) => {
    if (path.includes(history.location.pathname)) {
      return { color: "rgb(67,176,42)", minWidth: "30px" };
    } else {
      return { color: "black", minWidth: "30px" };
    }
  };
  console.log(pages);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const logout = () => {
    let config = {
      method: "post",
      url: process.env.REACT_APP_URL + "admin/logout",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: "",
    };

    axios(config)
      .then((response) => {
        Cookies.remove("token");
        props.history.push("/")
        // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const menus = [
    {
      name: "Summary Dashboard",
      icon: <BallotIcon />,
      path: ["/summary-dashboard"],
    },
    {
      name: "Sentiment Analysis",
      icon: <SentimentVerySatisfiedIcon />,
      path: [
        "/sentimental-analysis/area-chart",
        "/sentimental-analysis/pie-chart",
        "/sentimental-analysis/line-chart",
        "/sentimental-analysis/semi-donut-chart",
        "/sentimental-analysis/bar-chart",
        "/sentimental-analysis/stack-chart",
      ],
    },
    {
      name: "Mood Analysis",
      icon: <ChildCareIcon />,
      path: [
        "/mood-analysis/area-chart",
        "/mood-analysis/pie-chart",
        "/mood-analysis/line-chart",
      ],
    },
    {
      name: "Influencer Analysis",
      icon: <EmojiPeopleIcon />,
      path: ["/influencer-analysis"],
    },
    {
      name: "Word Cloud",
      icon: <AppsIcon />,
      path: ["/word-cloud/sentiment" /*,'/word-cloud/mood'*/],
    },
    {
      name: "Trending Subject",
      icon: <TrendingUpIcon />,
      path: ["/trending-subject/sentiment", "/trending-subject/mood"],
    },

    {
      name: "Trend Analysis",
      icon: <WhatshotIcon />,
      path: [
        "/trend-analysis/line-chart",
        "/trend-analysis/bar-chart",
        "/trend-analysis/area-chart",
        "/trend-analysis/pie-chart",
        "/trend-analysis/stacked-bar-chart",
        "/trend-analysis/semi-pie-chart",
      ],
    },
    {
      name: "Live Analysis",
      icon: <CalendarViewDayIcon />,
      path: ["/Live-analysis"],
    },
    {
      name: "Export Data",
      icon: <MoveToInboxIcon />,
      path: ["/export-data"],
    },
    {
      name: "Administration",
      icon: <PermDataSettingIcon />,
      path: ["/admin"],
    },
    {
      name: "Fetch",
      icon: <PageviewIcon />,
      path: ["/global-search"],
    },
    {
      name: "Search",
      icon: <SearchIcon />,
      path: ["/search-from-db"],
    },
    {
      name: "Image Sentiment Analysis",
      icon: <ImageSearchIcon />,
      path: ["/image-gallery"],
    },
    {
      name: "Geo HotSpot Analysis",
      icon: <PublicIcon />,
      path: ["/geo-hotspot"],
    },
    {
      name: "Demography",
      icon: <DeviceHubIcon />,
      path: ["/demography"],
    },
    {
      name: "Behavior Analysis",
      icon: <HdrWeakIcon />,
      path: ["/behavior-analysis"],
    },
    {
      name: "Add User",
      icon: <PersonAddIcon />,
      path: ["/add-user"],
    },
    {
      name: "Update/Delete User",
      icon: <UpdateIcon />,
      path: ["/updateDelete-user"],
    },
    // {
    //   name: "Delete User",
    //   icon: <DeleteIcon/>,
    //   path: ["/delete-user"]
    // },
    {
      name: "Change Password",
      icon: <LockIcon />,
      path: ["/change-password"],
    },
    {
      name: "Add Role",
      icon: <PersonAddIcon />,
      path: ["/add-role"],
    },
    {
      name: "Update/delete Role",
      icon: <UpdateIcon />,
      path: ["/updateDelete-role"],
    },
  ];
 
  const menus1 = [
    
    {
      name: "Summary Dashboard",
      icon: <BallotIcon />,
      path: ["/summary-dashboard"],
    },
    {
      name: "Sentiment Analysis",
      icon: <SentimentVerySatisfiedIcon />,
      path: [
        "/sentimental-analysis/area-chart",
        "/sentimental-analysis/pie-chart",
        "/sentimental-analysis/line-chart",
        "/sentimental-analysis/semi-donut-chart",
        "/sentimental-analysis/bar-chart",
        "/sentimental-analysis/stack-chart",
      ],
    },
    {
      name: "Mood Analysis",
      icon: <ChildCareIcon />,
      path: [
        "/mood-analysis/area-chart",
        "/mood-analysis/pie-chart",
        "/mood-analysis/line-chart",
      ],
    },
    {
      name: "Influencer Analysis",
      icon: <EmojiPeopleIcon />,
      path: ["/influencer-analysis"],
    },
    {
      name: "Word Cloud",
      icon: <AppsIcon />,
      path: ["/word-cloud/sentiment" /*,'/word-cloud/mood'*/],
    },
    {
      name: "Trending Subjects",
      icon: <TrendingUpIcon />,
      path: ["/trending-subject/sentiment", "/trending-subject/mood"],
    },]


  const drawer = (
    
    <div className={classes.drawerScroller}>
      <div id="userMenuHeader">
        <Grid container>
          <Grid item xs={1} />
          <Grid item align="left" xs={10}>
            <Avatar
              alt="karthik"
              id="userAvatar"
              src={require("../../imgs/user.jpg")}
            />
          </Grid>
          <Grid item align="right" className="grid-user" xs={6}>
  <Typography> Welcome {name}</Typography>
          </Grid>
        
          <Grid item align="left" className="grid-user" xs={4}>
            <Typography align="left">
              <ArrowDropDownIcon />
            </Typography>
          </Grid>
        </Grid>
      </div>
      <Divider style={{ marginTop: "120px" }} />
      <List>
          {
            menus.map((menuItem, index) => (
          pages.map((page,index1)=>
          // console.log(menuItem.name,page)
          menuItem.name===page?
          (<Link
            to={menuItem.path[0]}
            key={index}
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button key={index}>
              <ListItemIcon style={currentTab(history, menuItem.path)}>
                {" "}
                {menuItem.icon}{" "}
              </ListItemIcon>
              <ListItemText
                style={currentTab(history, menuItem.path)}
                classes={{ primary: classes.listItemText }}
                primary={menuItem.name}
              />
            </ListItem>
            <Divider />
          </Link>)
          :"")))}
        
      </List>
    </div>
  );


  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <TrendAnalysisContext>
      <TrendingSubjectContext>
        <WordCloudContext>
          <MoodAnalysisContext>
            <SentimentAnalysisContext>
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
                    <Avatar
                      alt="LOGO"
                      src={require("../../imgs/logo.png")}
                      style={{ height: "100%" }}
                    />
                    <Typography variant="h6" noWrap>
                      &nbsp; Sentiment and Mood Analysis
                    </Typography>
                    <span style={{ marginLeft: "auto" }}>
                      <Tooltip title={"Logout"}>
                        <Button
                          color="inherit"
                          onClick={() => logout()}
                          component={Link}
                          to="/"
                        >
                          <ExitToAppIcon />
                        </Button>
                      </Tooltip>
                    </span>
                  </Toolbar>
                </AppBar>
                <nav
                  className={classes.drawer}
                  id="scroll-id"
                  aria-label="mailbox folders"
                >
                  <Hidden smUp implementation="css">
                    <Drawer
                      container={container}
                      variant="temporary"
                      anchor={theme.direction === "rtl" ? "right" : "left"}
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
            </SentimentAnalysisContext>
          </MoodAnalysisContext>
        </WordCloudContext>
      </TrendingSubjectContext>
    </TrendAnalysisContext>
  );
};

export default withRouter(SideNavBar);
