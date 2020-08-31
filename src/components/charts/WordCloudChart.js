import React, { useEffect } from 'react'
import Highcharts from 'highcharts'
import highchartsWordCloud from "highcharts/modules/wordcloud";
require('highcharts/modules/exporting')(Highcharts);


function WordCloud(props) {

    useEffect(() => {
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
    
        highchartsWordCloud(Highcharts)
    
        let config =  {
            series: [{
                type: 'wordcloud',
                data: props.data,
                name: 'Occurrences',
                style:{
                    fontFamily:`Baloo Da 2`
                }
            }],
            title: {
                text: ''
            },
            credits: {
                enabled: false
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
                buttons: {
                    contextButton: {
                        symbol: 'download'
                    }
                }
            },
        }        
        Highcharts.chart('container',config)
    }, [props.data])

    
    return <div  id="container" />
}

export default WordCloud
