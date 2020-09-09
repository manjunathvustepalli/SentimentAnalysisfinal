import React, { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
require('highcharts/modules/exporting')(Highcharts);


function AreaChart(props) {

    Highcharts.SVGRenderer.prototype.symbols.download = function (x, y, w, h) {
        var path = [
            'M', x + w * 0.5, y,
            'L', x + w * 0.5, y + h * 0.7,
            'M', x + w * 0.3, y + h * 0.5,
            'L', x + w * 0.5, y + h * 0.7,
            'L', x + w * 0.7, y + h * 0.5,
            'M', x, y + h * 0.9,
            'L', x, y + h,
            'L', x + w, y + h,
            'L', x + w, y + h * 0.9
        ];
        return path;
    };
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
                text: 'Data'
            },
            labels: {
                formatter: function () {
                    return this.value
                }
            }
        },
        credits: {
            enabled: false
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
            fallbackToExportServer: false,
            buttons: {
                contextButton: {
                    symbol: 'download'
                }
            }
        },
    }
    return <HighchartsReact  options={config}> </HighchartsReact>
}

export default AreaChart
