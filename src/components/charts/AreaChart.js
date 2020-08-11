import React, { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official';


function AreaChart(props) {

    const [series, setseries] = useState([])

    useEffect(() => {
        let data = []
        Object.keys(props.data).forEach(key => {
            if(key !== 'dates')
                data.push({name:key,data:props.data[key],color:props.colors[key]})
        })
        setseries(data)
    },[props.data])


    let config =  {
        chart: {
            type: 'areaspline'
        },
        xAxis: {
            categories: props.data.dates,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
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
        series
    }
    return <HighchartsReact  options={config}> </HighchartsReact>
}

export default AreaChart
