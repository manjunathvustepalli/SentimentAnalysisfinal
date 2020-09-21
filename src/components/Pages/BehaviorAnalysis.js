import React, { useState } from "react";
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
import DemographyDonutChart from "../charts/DemographyCharts/DemographyDonutChart";
import DemographyPieChart from "../charts/DemographyCharts/DemographyPieChart";
import "./icons.css";
import BarChart from "../charts/BehaviorAnalysisCharts/BarChart";
function BehaviorAnalysis() {
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
    discStyle:{
      color: "black",
      textAlign: "center",
      fontWeight:"lighter",
      position: "relative",
      top:"50%",
      zIndex: "10"
    }
  }));

  const classes = useStyles();

  return (
      <div style={{ backgroundColor: "#F7F7F7", padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item md={8} sm={12}>
            <Typography style={{ color: "#43B02A", fontSize: "30px" }}>
              Behavior Analysis
            </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card className={classes.main}>
                    <CardContent>Account fake or real</CardContent>
                    <DemographyDonutChart color1="#f21649" color2="#349eeb" data={ [
                      ["Real", 35],
                      ["Fake", 65],
                    ]}/>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card className={classes.main}>
                    <CardContent>Big 5 Personality Framework | Twitter</CardContent>
                    <BarChart />
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card className={classes.main}>
                    <CardContent>Disc Framework | Source Twitter</CardContent>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={3}>
                        <DemographyDonutChart  data={[{name:'dominant',y:65,color:'#f21649'},{name:'others',y:35,color:'#349eeb'}]} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <DemographyDonutChart data={[{name:'Inspiring',y:65,color:'#9e1c39'},{name:'others',y:35,color:'#349eeb'}]} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <DemographyDonutChart data={[{name:'Supportive',y:65,color:'#f21649'},{name:'others',y:35,color:'#349eeb'}]} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <DemographyDonutChart data={[{name:'Cautious',y:65,color:'#9e1c39'},{name:'others',y:35,color:'#349eeb'}]} />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} >
                  <Card className={classes.main} style={{minHeight:'300px'}}>
                    <CardContent>Audience Behaviour Analysis - Brand Affinities</CardContent>
                    <DemographyPieChart />  
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} >
                  <Card className={classes.main} style={{minHeight:'300px'}}>
                    <CardContent>Audience Behavior Analysis - The Media Consumption Habits</CardContent>
                    <DemographyPieChart />
                  </Card>
                </Grid>
              </Grid>
          </Grid>
          <Grid item sm={12} md={4}>
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

export default BehaviorAnalysis;
