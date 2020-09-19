import React, { useState } from "react";
import SideNav from "../Navigation/SideNav";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  makeStyles,
} from "@material-ui/core";
import FilterWrapper from "../Filters/FilterWrapper";
import AccordianFilters from "../Filters/AccordianFilters";
import FilterHeader from "../Filters/FilterHeader";
import { addMonths } from "../../helpers";
import DemographyAgeChart from "../charts/DemographyCharts/DemographyAgeChart";
import DemographyDonutChart from "../charts/DemographyCharts/DemographyDonutChart";
import DemographyPieChart from "../charts/DemographyCharts/DemographyPieChart";
import DemographyBubble from "../charts/DemographyCharts/DemographyBubble";
import "./icons.css";
function TrendAnalysis() {
  const [refresh, setRefresh] = useState(true);
  const [sources, setSources] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [from, setFrom] = useState(addMonths(new Date(), -1));
  const [to, setTo] = useState(addMonths(new Date(), 0));
  const [moods, setMoods] = useState({});
  const [sentiments, setSentiments] = useState({});

  const useStyles = makeStyles((theme) => ({
    main: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#CB0038",
    },
    formControl: {
      margin: "20px",
      fullWidth: true,
      display: "flex",
      wrap: "nowrap",
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    dataDate: {
      fontSize: 20,
      fontWeight: "bold",
      color: "black",
      marginTop: 50,
    },
    paper: {
      height: 140,
      width: 130,
    },
    tabbar: {
      marginBottom: "20px !important",
    },
    gridposition: {
      position: "relative",
    },
  }));

  const classes = useStyles();

  return (
      <div style={{ backgroundColor: "#F7F7F7", padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item md={8} sm={12}>
          <Typography style={{ color: "#43B02A", fontSize: "30px" }}>
            Demography
          </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} >
              <Card className={classes.main} >
              <CardContent>Gender
              <p
                style={{
                  textAlign: "center",
                  fontWeight: 'lighter',
                  color: "black",
                }}
              >
                Gender Wise post
              </p>
              <p
                style={{
                  textAlign: "center",
                  color: "black",
                }}
              >
                June 2020
              </p>
              </CardContent>
                <Grid container spacing={1} className={classes.gridposition}>
                  <Grid item xs={4}>
                    <DemographyDonutChart
                      data={[{name:'male',y:65,color:'rgba(245, 12, 12)'},{name:'others',y:35,color:'rgba(237, 230, 230)'}]}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <DemographyDonutChart
                      data={[{name:'female',y:35,color:'#0e59ed'},{name:'others',y:65,color:'rgba(237, 230, 230)'}]}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <DemographyDonutChart
                      data={[{name:'female',y:3,color:'#60656e'},{name:'others',y:65,color:'rgba(237, 230, 230)'}]}
                      color1="#60656e"
                      color2="rgba(237, 230, 230)"
                    />
                  </Grid>
                </Grid>
              </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className={classes.main}>
                  <CardContent>Age</CardContent>
                  <div style={{padding:'21px 0'}} >
                    <DemographyAgeChart  />
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className={classes.main}>
                  <CardContent>Martial Status</CardContent>
                  <DemographyDonutChart 
                  
                  color1="#f21649" color2="#349eeb" />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className={classes.main}>
                  <CardContent>Parental Status</CardContent>
                  <DemographyDonutChart color1="#9e1c39" color2="#2ce654" />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className={classes.main}>
                  <CardContent>Professional Status</CardContent>
                  <DemographyPieChart />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                  <Card className={classes.main}>
                    <CardContent>Hobbies and Interest</CardContent>
                    <DemographyBubble />
                  </Card>
                </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} sm={12} >
            <Grid container spacing={3} style={{position:'sticky',top:'60px'}} >
              <Grid item xs={12}>
                <FilterHeader refresh={[refresh, setRefresh]} />
              </Grid>
              <Grid item xs={12}>
                <FilterWrapper>
                  <AccordianFilters
                    toFromDatesHandlers={[setFrom, setTo,from,to]}
                    sources={[sources, setSources]}
                    languages={[languages, setLanguages]}
                    moods={[moods, setMoods]}
                    sentiments={[sentiments, setSentiments]}
                  />
                </FilterWrapper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
  );
}

export default TrendAnalysis;
