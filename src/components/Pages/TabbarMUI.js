import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import TrendAnalysisLineChart from "../charts/TrendAnalysisLineChart";

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
    width: "100%",
    marginLeft: "30px !important",
    backgroundColor: theme.palette.background.paper,
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
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Twitter" {...a11yProps(0)} />
          <Tab label="YouTube" {...a11yProps(1)} />
          <Tab label="Facebook" {...a11yProps(2)} />
          <Tab label="Instagram" {...a11yProps(3)} />
          <Tab label="Other Electronic Media" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TrendAnalysisLineChart />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TrendAnalysisLineChart />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TrendAnalysisLineChart />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <TrendAnalysisLineChart />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <TrendAnalysisLineChart />
      </TabPanel>
    </div>
  );
}
export default TabbarMUI;
