import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom"
import SentimentalAnalysisAreaChart from '../Pages/SentimentAnalysisAreaChart'
import SentimentalAnalysisPieChart from '../Pages/SentimentAnalysisPieChart'
import SideNavBar from '../Navigation/SideNav'


function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={SideNavBar}  />
                <Route path='/sentimental-analysis/area-chart' exact component={SentimentalAnalysisAreaChart}  />
                <Route path='/sentimental-analysis/pie-chart' exact component={SentimentalAnalysisPieChart} />
                <Route component={SideNavBar}  />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes
