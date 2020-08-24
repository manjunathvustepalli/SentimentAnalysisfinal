import React, { useState } from "react";
import SideNav from "../Navigation/SideNav";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  makeStyles,
} from "@material-ui/core";
import FilterWrapper from "../Filters/FilterWrapper";
import AccordianFilters from "../Filters/AccordianFilters";
import FilterHeader from "../Filters/FilterHeader";
import { addMonths } from "../../helpers";
import TrendingSubjectsTable from "../Tables/TrendingSubjectsTable";
import TrendingSubjectsBarChart from "../charts/TrendingSubjectsBarChart";

function InfluencerAnalysis() {
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
      display: "flex",
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
    tablecenter: {
      marginLeft: "30px !important",
    },
  }));

  const classes = useStyles();

  return (
    <SideNav>
      <Typography style={{ color: "#43B02A", fontSize: "30px" }}>
        Trending Subjects
      </Typography>
      <div style={{ backgroundColor: "#F7F7F7", padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item md={8} sm={12}>
            <Card className={classes.main}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={6}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="select-table">Select Type</InputLabel>
                    <Select
                      labelId="select-table"
                      id="demo-simple-select-outlined"
                      varient={"standard"}
                    >
                      <MenuItem selected value="Postitive">
                        Postitive
                      </MenuItem>
                      <MenuItem value="Negative">Negative</MenuItem>
                      <MenuItem value="Neutral">Neutral</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="select-table">Select Type</InputLabel>
                    <Select
                      labelId="select-table"
                      id="demo-simple-select-outlined"
                      varient={"standard"}
                    >
                      <MenuItem selected value="Happy">
                        Happy
                      </MenuItem>
                      <MenuItem value="Sad">Sad</MenuItem>
                      <MenuItem value="Anger">Anger</MenuItem>
                      <MenuItem value="Anticipation">Anticipation</MenuItem>
                      <MenuItem value="Disgust">Disgust</MenuItem>
                      <MenuItem value="Suprice">Suprice</MenuItem>
                      <MenuItem value="Fear">Fear</MenuItem>
                      <MenuItem value="Trust">Trust</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} className={classes.tablecenter}>
                  <TrendingSubjectsBarChart />
                </Grid>
                <Grid item xs={11}>
                  <TrendingSubjectsTable />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item sm={12} md={4}>
            <Grid container spacing={3} style={{position:'sticky',top:'60px'}}>
              <Grid item xs={12}>
                <FilterHeader refresh={[refresh, setRefresh]} />
              </Grid>
              <Grid item xs={12}>
                <FilterWrapper>
                  <AccordianFilters
                    toFromDatesHandlers={[setFrom, setTo, addMonths]}
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
    </SideNav>
  );
}

export default InfluencerAnalysis;
