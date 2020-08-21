import React, { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
require('highcharts/modules/exporting')(Highcharts);


function AreaChart(props) {

    const [series, setseries] = useState([])

    useEffect(() => {
        let data = []
        if(!props.sorted){
            Object.keys(props.data).forEach(key => {
                if(key !== 'dates')
                    data.push({name:key,data:props.data[key],color:props.colors[key]})
            })
        } else {
            data = props.data
        }
        
        setseries(data)
    },[props.data])

    let config =  {
        chart: {
            type: 'areaspline'
        },
        title: {
            text:'',
        },
        xAxis: {
            categories: props.data.dates || props.dates,
            tickmarkPlacement: 'on',
        },
        yAxis: {
            title: {
                text: 'documents'
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
        series,
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
    return <HighchartsReact  options={config}> </HighchartsReact>
}

export default AreaChart
