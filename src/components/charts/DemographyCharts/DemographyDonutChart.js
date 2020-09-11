import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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

    plotOptions: {
      pie: {
        innerSize: "80%",
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          distance: props.data? 10: -50
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
