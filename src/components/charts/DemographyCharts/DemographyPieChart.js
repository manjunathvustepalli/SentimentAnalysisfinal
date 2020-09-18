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
  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      height:'200px'
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    credits: {
      enabled: false
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
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
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          distance:10,
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Brands",
        colorByPoint: true,
        data: [
          {
            name: "Service/Private",
            y: 61.41,
            sliced: true,
            selected: true,
          },
          {
            name: "Service/Govt",
            y: 10.85,
          },
          {
            name: "Self Employed",
            y: 4.67,
          },
          {
            name: "Farming",
            y: 4.18,
          },
          {
            name: "NRB",
            y: 1.64,
          },
          {
            name: "Retired/Unemployed",
            y: 1.6,
          },
        ],
      },
    ],
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default DemographyDonutChart;
