import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom"
import SentimentalAnalysis from '../pages/sentiment-wise-trend.component'
import SentimentalAnalysis2 from '../pages/sentiment-analysis.component'
import Moodanalysis from '../pages/mood-analysis.component'


function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/sentimentalanalysis/areachart' component={SentimentalAnalysis}  />
                <Route path='/sentimentalanalysis/piechart' component={SentimentalAnalysis2} />
                <Route path='/moodanalysis/areachart' component={Moodanalysis} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes
