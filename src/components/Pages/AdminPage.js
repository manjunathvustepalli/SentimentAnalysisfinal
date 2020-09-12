import React, { useState } from 'react'
import SideNav from '../Navigation/SideNav'
import { makeStyles, AppBar, Tabs, Tab, Box, Grid } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import MaterialTable from 'material-table';
import AdminPageTable from '../Tables/AdminPageTable';

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

function AdminPage() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [keywords, setKeywords] = useState([{ keyword:'EXAarmy' },{ keyword:'BTS' },{ keyword:'Bangladesh' },{ keyword:'EXAarmy' },{keyword:'বাজপাখি'}])
    const [screenNames, setScreenNames] = useState([{screenName:'zapalak'},{screenName:'mokhlesurphy'}])
    const [keywordColumns, setKeywordColumns] = useState([
      {
        title:'Keyword',
        field:'keyword'
      },
    ])
    const [screenNameColumns, setScreenNameColumns] = useState([
        {
            title:'Screen Name',
            field:'screenName'   
        }
    ])

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    return (
        <SideNav>
            <Grid container style={{marginTop:'40px'}}>
                <Grid item xs={1}/>
                <Grid item xs={10}>
                <AppBar position="static" color="default">
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
                    <Tab label={'Keywords'} style={{color:value===0 && ('white'),backgroundColor:value===0 && ('rgb(67, 176, 42)'),border:value !== 0 && ('2px solid rgb(67, 176, 42)')}} {...a11yProps(0)} />
                    <Tab label={'Screen Names'} style={{color:value===1 && ('white'),backgroundColor:value===1 && ('rgb(67, 176, 42)'),border:value !== 1 && ('2px solid rgb(67, 176, 42)')}} {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                    <TabPanel value={value} index={0}>
                        <AdminPageTable data={keywords} columns={keywordColumns} name={'Manage Keywords'} setData={setKeywords} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <AdminPageTable data={screenNames} columns={screenNameColumns} name={'Manage Screen names'} setData={setScreenNames} />
                    </TabPanel>
                </Grid>
                <Grid item xs={1}/>
            </Grid>
      
        </SideNav>
    )
}

export default AdminPage
