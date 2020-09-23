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

            plotOptions: {
                series: {
                    events: {
                        legendItemClick: function() {
                          return false;
                        }
                    }
                }
            },            
            series: [{
                type: 'wordcloud',
                events: {
                    click: function (event) {
                        console.log(event)
                        alert(
                            this.name + ' clicked\n' +
                            'Alt: ' + event.altKey + '\n' +
                            'Control: ' + event.ctrlKey + '\n' +
                            'Meta: ' + event.metaKey + '\n' +
                            'Shift: ' + event.shiftKey
                        );
                    }
                },
                data: props.data,
            }],
            title: {
                text: props.title || ''
            },
            credits: {
                enabled: false
            },
            tooltip: {
                headerFormat: '',
                pointFormat:
                  '<span>{point.name} : </span><b>{point.weight}',
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
    }, [props.data,props.title])

    
    return <div  id="container" />
}

export default WordCloud
