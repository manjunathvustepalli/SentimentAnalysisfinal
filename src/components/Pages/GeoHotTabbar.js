import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Maps1 from "../charts/Maps/Maps1";
import GeoHotSpotMap from "../charts/Maps/GeoHotSpotMap";
import { green } from '@material-ui/core/colors';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "95%",
    marginLeft: "20px",
    marginBottom: "20px",
    backgroundColor: 'white',
    paddingBottom: "30px !important",
  },
}));

function TabbarMUI() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{style: {background:green[800]}}}
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Sentiment" style={{color:value===0 && (green[800])}} {...a11yProps(0)} />
          <Tab label="Mood" style={{color:value===1 && (green[800])}} {...a11yProps(1)} />
          <Tab label="Spatio Temporal" style={{color:value===2 && (green[800])}} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <GeoHotSpotMap />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GeoHotSpotMap />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GeoHotSpotMap />
      </TabPanel>
    </div>
  );
}
export default TabbarMUI;
