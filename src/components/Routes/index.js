import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SentimentalAnalysisAreaChart from "../Pages/SentimentAnalysisAreaChart";
import SentimentalAnalysisLineChart from "../Pages/SentimentAnalysisLineChart";
import SentimentalAnalysisPieChart from "../Pages/SentimentAnalysisPieChart";
import SentimentalAnalysisSemiDonutChart from "../Pages/SentimentAnalysisSemiDonutChart";
import SideNavBar from "../Navigation/SideNav";
import MoodAnalysisAreaChart from "../Pages/MoodAnalysisAreaChart";
import MoodAnalysisPieChart from "../Pages/MoodAnalysisPieChart";
import MoodAnalysisLineChart from "../Pages/MoodAnalysisLineChart";
import InfluencerAnalysis from "../Pages/InfluencerAnalysis";
import TrendAnalysis from "../Pages/TrendAnalysis";
import Demography from "../Pages/Demography";
import TrendingSubjects from "../Pages/TrendingSubjects";
import LiveAnalysis from "../Pages/LiveAnalysis";
import SummaryDashBoard from "../Pages/SummaryDashBoard";
import BehaviorAnalysis from "../Pages/BehaviorAnalysis";
import Login from "../Pages/Login";
import GeoHotSpotAnalysis from "../Pages/GeoHotSpotAnalysis";
import wordCloudSentiment from "../Pages/WordCloudSentiment";
import WordCloudMood from "../Pages/WordCloudMood";
import ExportData from "../Pages/ExportData";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/summary-dashboard" exact component={SummaryDashBoard} />
        <Route
          path="/sentimental-analysis/area-chart"
          exact
          component={SentimentalAnalysisAreaChart}
        />
        <Route
          path="/sentimental-analysis/pie-chart"
          exact
          component={SentimentalAnalysisPieChart}
        />
        <Route
          path="/sentimental-analysis/semi-donut-chart"
          exact
          component={SentimentalAnalysisSemiDonutChart}
        />
        <Route
          path="/sentimental-analysis/line-chart"
          exact
          component={SentimentalAnalysisLineChart}
        />
        <Route
          path="/mood-analysis/area-chart"
          exact
          component={MoodAnalysisAreaChart}
        />
        <Route
          path="/mood-analysis/pie-chart"
          exact
          component={MoodAnalysisPieChart}
        />
        <Route
          path="/mood-analysis/line-chart"
          exact
          component={MoodAnalysisLineChart}
        />
        <Route path="/word-cloud/sentiment" exact component={wordCloudSentiment} />
        <Route path="/word-cloud/mood" exact component={WordCloudMood} />
        <Route
          path="/influencer-analysis"
          exact
          component={InfluencerAnalysis}
        />
        <Route path="/trend-analysis" exact component={TrendAnalysis} />
        <Route path="/demography" exact component={Demography} />
        <Route path="/trending-subject" exact component={TrendingSubjects} />
        <Route path="/live-analysis" exact component={LiveAnalysis} />
        <Route path="/export-data" exact component={ExportData} />
        <Route path="/behavior-analysis" exact component={BehaviorAnalysis} />
        <Route path="/geo-hotspot" exact component={GeoHotSpotAnalysis} />

        <Route component={SideNavBar} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
