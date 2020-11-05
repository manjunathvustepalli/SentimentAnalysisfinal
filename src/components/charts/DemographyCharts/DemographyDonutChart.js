import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require('highcharts/modules/exporting')(Highcharts);


function DemographyDonutChart(props) {

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

  let data = props.data ? props.data: [
    ["", 35],
    ["", 65],
  ];
  const options = {
    chart: {
      type: "pie",
      height:'200px'
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    credits: {
      enabled: false
  },
  exporting: {
    chartOptions: {
        title:{
            style:{
                fontSize:'10px'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    style:{
                        fontSize:'6px'
                    }
                }
                
            }
        }
    },
    scale: 4,
    fallbackToExportServer: false,
    buttons: {
        contextButton: {
            symbol: 'download'
        }
    }
},
    plotOptions: {
      pie: {
        innerSize: "80%",
        allowPointSelect: true,
        cursor: "pointer",
        showInLegend:'true',
        dataLabels: {
          enabled: false,
          distance: -20,
          style:{
            color:'black',
            textOutline:'none',
          }
        },
      },
    },
    colors: [props.color1, props.color2],
    series: [
      {
        data,
      },
    ],
  };
  return   <HighchartsReact highcharts={Highcharts} options={options} />
}

export default DemographyDonutChart;
