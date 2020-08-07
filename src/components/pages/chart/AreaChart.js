import React from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


function AreaChart(props) {

    const [XaxiesData,negativeData,neutralData,positiveData,source] = props.data

    let config =  {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: 'Area chart'
        },
        subtitle: {
            text: `Source: ${source}`
        },
        xAxis: {
            categories: XaxiesData,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'Billions'
            },
            labels: {
                formatter: function () {
                    return this.value / 1000;
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
        colors: ['rgba(255,0,0,0.8)','rgb(0,255,0,0.6)','rgba(235,255,0,0.1)'],
        series: [{
            name: 'Negative',
            data: negativeData
        }, {
            name: 'Positive',
            data: positiveData
        }, {
            name: 'Neutral',
            data: neutralData
        }]
    }
    return <HighchartsReact  options={config}> </HighchartsReact>
}

export default AreaChart
