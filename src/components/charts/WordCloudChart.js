import React from 'react'
import Highcharts from 'highcharts'
import highchartsWordCloud from "highcharts/modules/wordcloud";
import HighchartsReact from 'highcharts-react-official';
require('highcharts/modules/exporting')(Highcharts);


function WordCloud(props) {

    highchartsWordCloud(Highcharts)

    let config =  {
        series: [{
            type: 'wordcloud',
            data: props.data,
            name: 'Occurrences'
        }],
        title: {
            text: ''
        },
        exporting: {
            chartOptions: {
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        }
                        
                    }
                }
            },
            scale: 3,
            fallbackToExportServer: false
        },
    }

    return <HighchartsReact  highcharts={Highcharts} options={config} />
}

export default WordCloud
