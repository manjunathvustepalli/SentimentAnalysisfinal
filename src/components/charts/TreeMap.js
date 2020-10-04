import React from 'react'
import Highcharts from 'highcharts'
import HighchartsTreeMap from "highcharts/modules/treemap";
import HighchartsReact from 'highcharts-react-official';
require('highcharts/modules/exporting')(Highcharts);

function TreeMap(props) {
    
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

    HighchartsTreeMap(Highcharts)

    let config = {
        credits: {
            enabled: false
        },
        exporting: {
            chartOptions: {
                plotOptions: {
                    treemap:{
                        dataLabels:{
                            enabled:true,
                            style:{
                                color:'black'
                            }
                        }
                    },
                    series: {
                        treemap:{
                            label:{
                                enabled:true,
                                style:{
                                    color:'black'
                                }
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            style:{
                                color:'black',
                                fontSize:'2rem'
                            }
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
        series: [{
            type: "treemap",
            enableMouseTracking: false,
            layoutAlgorithm: 'stripes',
            alternateStartingDirection: true,
            treemap:{
                label:{
                    style:{
                        fontWeight: 'bold',
                        color: 'black',
                        fontSize:'0.8rem',
                        textOutline:'none',
                        border:'none'
                    }
                }
            },
            levels: [{
                level: 1,
                dataLabels: {
                    enabled: false,
                    align: 'left',
                    verticalAlign: 'top',
                    style: {
                        fontWeight: 'bold',
                        color: 'black',
                        fontSize:'0.8rem',
                        textOutline:'none',
                        border:'none'
                      },
                }
            }],
            data: props.data,
        }],
        title: {
            text: props.title || ''
        }
    }
    
    return <HighchartsReact highcharts={Highcharts} options={config} />
}

export default TreeMap
