import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Box, Grid } from '@material-ui/core';
import AdminPageTable from '../Tables/AdminPageTable';
import useDidUpdateEffect from '../custom Hooks/useDidUpdateEffect'
import Axios from 'axios';

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

  

function AdminPage() {
    const [value, setValue] = React.useState(0);
    const [data, setData] = useState({})
    const [keywords, setKeywords] = useState([])
    const [screenNames, setScreenNames] = useState([])
    const [keywordColumns] = useState([
      {
        title:'Keyword',
        field:'keyword'
      },
    ])
    const [screenNameColumns] = useState([
        {
            title:'Screen Name',
            field:'screenName'   
        }
    ])

    useEffect(() => {
      Axios.get('http://cors-anywhere.herokuapp.com/http://arijit-e979c0f6.localhost.run/bsma-webservice/getasynctwitterconfig')
        .then(fetchedData =>{
          setData( {
            keywords:fetchedData.data.keywords.map(keyword => {
              return {
                keyword:keyword
              }
            }),
            screenNames:fetchedData.data.handles.map(handle => {
              return {
                screenName:handle
              }
            })
          }) 
        })
    }, [])

    useDidUpdateEffect(()=>{
      console.log(data.screenNames.map(screenNameObj => screenNameObj.screenName).join(','))
      Axios.post(`http://cors-anywhere.herokuapp.com/http://arijit-e979c0f6.localhost.run/bsma-webservice/setasynctwitterconfig?keywords=${data.keywords.map(keywordObj => keywordObj.keyword).join(',')}&handles=${data.screenNames.map(screenNameObj => screenNameObj.screenName).join(',')}`)
        .then(data => {
          console.log(data)
        })
        .catch(err=>{
          console.log(err)
        })
    },[data])

      
    const handleChange = (event, newValue) => setValue(newValue)
    return (
            <Grid container style={{marginTop:'40px'}}>
                <Grid item xs={1}/>
                <Grid item xs={10}>
                    <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    TabIndicatorProps={{style: {background:'rgb(67, 176, 42)'}}}
                    aria-label="scrollable auto tabs example"
                    >
                    <Tab label={'Keywords'} style={{color:value===0 && ('white'),backgroundColor:value===0 && ('rgb(67, 176, 42)'),border:value !== 0 && ('2px solid rgb(67, 176, 42)')}} {...a11yProps(0)} />
                    <Tab label={'Screen Names'} style={{color:value===1 && ('white'),backgroundColor:value===1 && ('rgb(67, 176, 42)'),border:value !== 1 && ('2px solid rgb(67, 176, 42)')}} {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <AdminPageTable data={data.keywords} objName={'keywords'} columns={keywordColumns} name={'Manage Keywords'} setData={setData} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <AdminPageTable data={data.screenNames} objName={'screenNames'} columns={screenNameColumns} name={'Manage Screen names'} setData={setData} />
                    </TabPanel>
                </Grid>
                <Grid item xs={1}/>
            </Grid>
    )
}

export default AdminPage
