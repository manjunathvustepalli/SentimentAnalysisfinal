import React, { Component } from 'react';
import Highcharts from 'highcharts'
require('highcharts/modules/exporting')(Highcharts);
const ReactHighcharts = require('react-highcharts');

export default class PieChart extends Component {
    render(){
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
        const config = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    innerSize: "80%",
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '{point.percentage:.1f} %',
                        distance: -50,
                    }
                }
            },
            series: [{
                name:this.props.name,
                colorByPoint: true,
                data: this.props.data
            }],
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
        return <ReactHighcharts config = {config} />
    }
}