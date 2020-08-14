import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SentimentalAnalysisAreaChart from "../Pages/SentimentAnalysisAreaChart";
import SentimentalAnalysisPieChart from "../Pages/SentimentAnalysisPieChart";
import SideNavBar from "../Navigation/SideNav";
import MoodAnalysisAreaChart from "../Pages/MoodAnalysisAreaChart";
import MoodAnalysisPieChart from "../Pages/MoodAnalysisPieChart";
import WordCloud from "../Pages/WordCloud";
import InfluencerAnalysis from "../Pages/InfluencerAnalysis";
import TrendAnalysis from "../Pages/TrendAnalysis";
import Demography from "../Pages/Demography";
import TrendingSubjects from "../Pages/TrendingSubjects";
import LiveAnalysis from "../Pages/LiveAnalysis";
import SummaryDashBoard from "../Pages/SummaryDashBoard";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={SummaryDashBoard} />
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
          path="/mood-analysis/area-chart"
          exact
          component={MoodAnalysisAreaChart}
        />
        <Route
          path="/mood-analysis/pie-chart"
          exact
          component={MoodAnalysisPieChart}
        />
        <Route path="/word-cloud" exact component={WordCloud} />
        <Route
          path="/influencer-analysis"
          exact
          component={InfluencerAnalysis}
        />
        <Route path="/trend-analysis" exact component={TrendAnalysis} />
        <Route path="/demography" exact component={Demography} />
        <Route path="/trending-subject" exact component={TrendingSubjects} />
        <Route path="/live-analysis" exact component={LiveAnalysis} />
        <Route component={SideNavBar} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
