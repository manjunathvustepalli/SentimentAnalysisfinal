import React from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


function AreaChart() {
    let config =  {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: 'Area chart'
        },
        subtitle: {
            text: 'Source: Twitter'
        },
        xAxis: {
            categories: ['14-06-2020', '15-06-2020', '16-06-2020', '17-06-2020','18-6-2020','19-6-2020'],
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
        colors: ['rgba(255,0,0,0.5)','rgba(235,255,0,0.5)','rgba(0,255,0,0.5)','rgba(0, 0, 255,0.5)','rgba(255, 0, 255,0.5)','rgba(255, 102, 0,0.5)','rgba(0, 51, 0,0.5)','rgba(204, 204, 255,0.5)'],
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
        series: [{
            name: 'Happy',
            data: [3000,1000,2000,5000,7000,500]
        }, {
            name: 'Sad',
            data: [0,450,1200,4600,2000,3000]
        }, {
            name: 'Anger',
            data: [7000,300,6500,5000,3000,1500]
        },
         {
            name: 'Anticipation',
            data: [7000,3200,6500,5000,300,1500]
        }, {
            name: 'Disgust',
            data: [7000,3200,6500,500,3000,1500]
        }, {
            name: 'Surprise',
            data: [7000,3200,6500,8000,3000,1500]
        }, {
            name: 'Fear',
            data: [7000,3200,600,5000,3000,1500]
        },{
            name:'Trust',
            data:[200,5000,2000,3500,1000,2600]
        }
    ]
    }
    return <HighchartsReact  options={config}> </HighchartsReact>
}

export default AreaChart
