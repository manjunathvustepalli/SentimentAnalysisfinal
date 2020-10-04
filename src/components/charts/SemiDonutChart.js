import React, { Component } from 'react';
import Highcharts from 'highcharts'
import { Height } from '@material-ui/icons';
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
                plotBorderWidth: 0,
                plotShadow: false,
                height:this.props.height
            },
            title: {
                text: '',
                align: 'center',
                verticalAlign: 'middle',
                y: 60
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    showInLegend: true,
                    dataLabels: {
                        enabled: true,
                        format: '{point.percentage:.1f} %',
                        distance: 20,
                        style: {
                            fontWeight: 'bold',
                            color: 'black',
                            fontSize:'0.7rem'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%'],
                    size: '60%',
                }
            },
            series: [{
                type: 'pie',
                name: 'Source Share',
                innerSize: '70%',
                data: this.props.data ||  [['twitter',30],['others',120]]
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