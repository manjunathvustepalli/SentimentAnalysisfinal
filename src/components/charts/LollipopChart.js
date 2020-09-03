import React from 'react'
import highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";
import highchartsLollipop from "highcharts/modules/lollipop";
require('highcharts/modules/exporting')(highcharts);

function LollipopChart() {
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
    const options = {
        chart: {
            type: 'lollipop'
        },
    
        accessibility: {
            point: {
                valueDescriptionFormat: '{index}. {xDescription}, {point.y}.'
            }
        },
    
        legend: {
            enabled: false
        },
    
        subtitle: {
            text: '2018'
        },
    
        title: {
            text: 'Top 10 Countries by Population'
        },
    
        tooltip: {
            shared: true
        },
    
        xAxis: {
            type: 'category'
        },
    
        yAxis: {
            title: {
                text: 'Population'
            }
        },
    
        series: [{
            name: 'Population',
            data: [{
                name: 'China',
                low: 1427647786
            }, {
                name: 'India',
                low: 1352642280
            }, {
                name: 'United States',
                low: 327096265
            }, {
                name: 'Indonesia',
                low: 267670543
            }, {
                name: 'Pakistan',
                low: 212228286
            }, {
                name: 'Brazil',
                low: 209469323
            }, {
                name: 'Nigeria',
                low: 195874683
            }, {
                name: 'Bangladesh',
                low: 161376708
            }, {
                name: 'Russia',
                low: 145734038
            }, {
                name: 'Mexico',
                low: 126190788
            }]
        }]
    
    }    
    return (
        <ReactHighcharts highcharts={highcharts} options={options} />
    )
}

export default LollipopChart
