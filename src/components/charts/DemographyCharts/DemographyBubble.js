import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

require("highcharts/modules/exporting")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);

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
      type: "packedbubble",
      height: "200px",
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false
    },
    tooltip: {
      useHTML: true,
      pointFormat: "<b>{point.name}:</b> {point.value}",
    },
    plotOptions: {
      packedbubble: {
        minSize: "30%",
        maxSize: "120%",
        zMin: 0,
        zMax: 1000,
        layoutAlgorithm: {
          splitSeries: false,
          gravitationalConstant: 0.01,
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          filter: {
            property: "y",
            operator: ">",
            value: 250,
          },
          style: {
            color: "black",
            textOutline: "none",
            fontWeight: "normal",
          },
        },
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
    series: [
      {
        name: "blogging",
        data: [
          {
            name: "blogging",
            value: 7,
          },
        ],
      },
      {
        name: "Travelling",
        data: [
          {
            name: "Travelling",
            value: 76,
          },
          {
            name: "Trecknig",
            value: 78,
          },
          {
            name: "Travelling",
            value: 76,
          }
        ],
      },
      {
        name: "photography",
        data: [
          {
            name: "photography",
            value: 101,
          },
        ],
      },
      {
        name: "Social Networking",
        data: [
          {
            name: "Social Networking",
            value: 101,
          },
        ],
      },
      {
        name: "Sports",
        data: [
          {
            name: "Sports",
            value: 101,
          },
        ],
      }
    ],
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default DemographyDonutChart;
