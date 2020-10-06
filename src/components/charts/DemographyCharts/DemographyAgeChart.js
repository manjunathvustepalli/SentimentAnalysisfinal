import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require('highcharts/modules/exporting')(Highcharts);


function DemographyAgeChart() {

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
  let config = {
    chart: {
      type: "areaspline",
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
    xAxis: {
      categories: [
        "14-06-2020",
        "15-06-2020",
        "16-06-2020",
        "17-06-2020",
        "18-6-2020",
        "19-6-2020",
      ],
      tickmarkPlacement: "on",
      title: {
        enabled: true,
        text:'Dates'
      },
    },
    yAxis: {
      title: {
        text: "Billions",
      },
      labels: {
        formatter: function () {
          return this.value / 1000;
        },
      },
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
    colors: [
      "rgba(52, 235, 232,0.5)",
      "rgba(255, 129, 61)",
      "rgba(230, 48, 78,0.5)",
    ],
    plotOptions: {
      area: {
        marker: {
          enabled: false,
          symbol: "circle",
          radius: 2,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    series: [
      {
        name: "Happy",
        data: [1000, 1000, 3000, 5000, 2000, 500],
      },
      {
        name: "Sad",
        data: [0, 450, 1200, 4600, 2000, 3000],
      },
      {
        name: "Anger",
        data: [0, 300, 200, 100, 3000, 1500],
      },
    ],
  };
  return <HighchartsReact highcharts={Highcharts} options={config} > </HighchartsReact>;
}

export default DemographyAgeChart;
