import React from "react";
import highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require('highcharts/modules/exporting')(highcharts);


function SemiDonutChart(props) {
    highcharts.SVGRenderer.prototype.symbols.download = function (x, y, w, h) {
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
    const data = props.data || [['negative',16],['positive',11],['neutral',30]]
    const options =  {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
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
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'black'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '110%'
            }
        },
        series: [{
            type: 'pie',
            name: 'Source Share',
            innerSize: '70%',
            data: [
                ['Twitter', 58.9],
                ['Others',300],
                
            ]
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

  return <HighchartsReact highcharts={highcharts} options={options} />
}

export default SemiDonutChart;