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
            data: [30,100,200,50,7,50]
        }, {
            name: 'Sad',
            data: [0,45,12,46,200,30]
        }, {
            name: 'Anger',
            data: [70,30,60,500,300,150]
        },
         {
            name: 'Anticipation',
            data: [70,30,60,50,30,150]
        }, {
            name: 'Disgust',
            data: [0,5,12,46,20,30]
        }, {
            name: 'Surprise',
            data: [30,100,200,50,7,50]
        }, {
            name: 'Fear',
            data: [30,10,20,50,7,50]
        },{
            name:'Trust',
            data:[30,20,20,50,70,0]
        }
    ]
    }
    return <HighchartsReact  options={config}> </HighchartsReact>
}

export default AreaChart
