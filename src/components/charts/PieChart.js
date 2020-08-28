import React, { Component } from 'react';
import Highcharts from 'highcharts'
require('highcharts/modules/exporting')(Highcharts);
const ReactHighcharts = require('react-highcharts');


export default class PieChart extends Component {
    render(){
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
                fallbackToExportServer: false
            },
        }
        return <ReactHighcharts config = {config} />
    }
}