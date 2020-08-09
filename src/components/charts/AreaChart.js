import React from 'react'
import HighchartsReact from 'highcharts-react-official';


function AreaChart(props) {

    const {dates,negativeData,neutralData,positiveData} = props

    let config =  {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: 'Area chart'
        },
        subtitle: {
            text: `Source:  `
        },
        xAxis: {
            categories: dates[0],
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'users'
            },
            labels: {
                formatter: function () {
                    return this.value
                }
            }
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        colors: ['rgba(255,0,0,0.5)','rgb(0,255,0,0.5)','rgba(235,255,0,0.5)'],
        series: [{
            name: 'Negative',
            data: negativeData[0]
        }, {
            name: 'Positive',
            data: positiveData[0]
        }, {
            name: 'Neutral',
            data: neutralData[0]
        }]
    }
    return <HighchartsReact  options={config}> </HighchartsReact>
}

export default AreaChart
