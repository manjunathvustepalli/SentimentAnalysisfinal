import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import TrendAnalysisLineChart from "../charts/TrendAnalysisLineChart";
import { green } from '@material-ui/core/colors';
import { capitalizeString } from "../../helpers";


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
    backgroundColor: 'white',
    paddingBottom: "30px !important",
  },
}));

function TabbarMUI(props) {
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
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{style: {background:green[400]}}}
          aria-label="scrollable auto tabs example"
        >
          {
            props.data[0] && (Object.keys(props.data[0]).map((source,i) => {
              return <Tab label={source} style={{color:value===i && ('white'),backgroundColor:value===i && ('rgb(67, 176, 42)'),border:value !== i && ('2px solid rgb(67, 176, 42)')}} {...a11yProps(i)} />
            }))
          }
        </Tabs>
      {
        props.data[0] && (
          Object.keys(props.data[0]).map((source,i) =>{
            return (
            <TabPanel value={value} index={i}>
              <TrendAnalysisLineChart title={`Date wise Language Trend in ${capitalizeString(source)}`} dates={props.data[1]} data={props.data[0][source]} />
            </TabPanel>
            )
          }) 
        )
      }
    </div>
  );
}
export default TabbarMUI;
