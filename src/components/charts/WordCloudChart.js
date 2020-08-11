import React from 'react'
import Highcharts from 'highcharts'
import highchartsWordCloud from "highcharts/modules/wordcloud";
import HighchartsReact from 'highcharts-react-official';


function WordCloud(props) {

    highchartsWordCloud(Highcharts)

    let config =  {
        series: [{
            type: 'wordcloud',
            data: props.data,
            name: 'Occurrences'
        }],
        title: {
            text: 'Wordcloud of Latest Trends'
        }
    }

    return <HighchartsReact  highcharts={Highcharts} options={config} />
}

export default WordCloud
