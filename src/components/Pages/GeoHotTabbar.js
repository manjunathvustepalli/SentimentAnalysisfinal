import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import GeoHotSpotMap from "../charts/Maps/GeoHotSpotMap";


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
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{style: {background:'rgb(67, 176, 42)'}}}
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Sentiment" style={{color:value===0 && ('white'),backgroundColor:value===0 && ('rgb(67, 176, 42)'),border:value !== 0 && ('2px solid rgb(67, 176, 42)')}} {...a11yProps(0)} />
          <Tab label="Mood" style={{color:value===1 && ('white'),backgroundColor:value===1 && ('rgb(67, 176, 42)'),border:value !== 1 && ('2px solid rgb(67, 176, 42)')}} {...a11yProps(1)} />
          <Tab label="Spatio Temporal" style={{color:value===2 && ('white'),backgroundColor:value===2 && ('rgb(67, 176, 42)'),border:value !== 2 && ('2px solid rgb(67, 176, 42)')}} {...a11yProps(2)} />
        </Tabs>
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
