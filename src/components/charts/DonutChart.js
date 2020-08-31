import React from "react";
import highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require('highcharts/modules/exporting')(highcharts);


function DonutChart(props) {
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
    const options = {
      chart: {
        type: "pie",
      },
      title: {
        text: props.heading || '',
      },
      plotOptions: {
        pie: {
          innerSize: "80%",
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            distance: -50,
          },
        },
      },
      series: [
        {
          name:"pie",
          data
        }
      ],
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
        buttons: {
          contextButton: {
              symbol: 'download'
          }
      }
    },
    }

  return <HighchartsReact highcharts={highcharts} options={options} />
}

export default DonutChart;