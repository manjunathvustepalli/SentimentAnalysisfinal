import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function BarChart(props) {
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
      type: "bar",
    },
    credits: {
      enabled: false
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    // colors: ["#32a852", "#c2081a", "#ebc909", "#0f94db", "#cc14bd"],
    xAxis: {
      categories: [
        "Open to experience",
        "Conscientiousness",
        "Extraversion",
        "Agreebleness",
        "Neuroticism",
      ],
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Population (millions)",
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
      valueSuffix: " millions",
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
      bar: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "top",
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
      shadow: true,
    },
    credits: {
      enabled: false,
    },
    series: [{ data: [500, 320, 647, 408, 400] }],
  };
  return  <HighchartsReact highcharts={Highcharts} options={options} />
}

export default BarChart;
