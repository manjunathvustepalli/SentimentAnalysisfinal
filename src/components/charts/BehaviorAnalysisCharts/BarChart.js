import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import downloadIcon from '../../../helpers/downloadIcon'

function BarChart(props) {
  Highcharts.SVGRenderer.prototype.symbols.download = downloadIcon
  const options = {
    chart: {
      type: "bar",
      height:'200px'
    },
    title: {
      text: "  ",
    },
    subtitle: {
      text: "",
    },
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
    credits: {
      enabled: false,
    },
    series: [{ data: [500, 320, 647, 408, 400] }],
  };
  return  <HighchartsReact highcharts={Highcharts} options={options} />
}

export default BarChart;
