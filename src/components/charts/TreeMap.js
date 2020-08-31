import React from 'react'
import Highcharts from 'highcharts'
import HighchartsTreeMap from "highcharts/modules/treemap";
import HighchartsReact from 'highcharts-react-official';
require('highcharts/modules/exporting')(Highcharts);

function TreeMap() {
    
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
        series: [{
            type: "treemap",
            layoutAlgorithm: 'stripes',
            alternateStartingDirection: true,
            levels: [{
                level: 1,
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'top',
                    style: {
                        fontSize: '15px',
                        fontWeight: 'bold'
                    }
                }
            }],
            data: [{
                id: 'A',
                name: 'Negative',
                color: "#EC2500"
            }, {
                id: 'B',
                name: 'Positive',
                color: "#9EDE00"
            }, {
                id: 'O',
                name: 'Neutral',
                color: '#EC9800'
            },{
                name: 'Anne',
                parent: 'A',
                value: 5
            }, {
                name: 'Rick',
                parent: 'A',
                value: 3
            }, {
                name: 'Peter',
                parent: 'A',
                value: 4
            }, {
                name: 'Anne',
                parent: 'B',
                value: 4
            }, {
                name: 'Rick',
                parent: 'B',
                value: 10
            }, {
                name: 'Peter',
                parent: 'B',
                value: 1
            }, {
                name: 'Anne',
                parent: 'O',
                value: 1
            }, {
                name: 'Rick',
                parent: 'O',
                value: 3
            }, {
                name: 'Peter',
                parent: 'O',
                value: 3
            }]
        }],

        title: {
            text: ''
        }
    }
    
    return <HighchartsReact highcharts={Highcharts} options={config} />
}

export default TreeMap
