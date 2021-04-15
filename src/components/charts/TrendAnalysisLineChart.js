import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";

function TrendAnalysisLineChart(props) {

  const { dates,data } = props
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
    title: {
      text: props.title || "",
    },
    chart: {
      height: props.height || "60%",
    },
    yAxis: {
      title: {
        text: "Article/posts count",
      },
    },
    xAxis: {
      categories: dates,
      crosshair: true,
      title: {
        text: "Date Range",
      },
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    credits: {
      enabled: false,
    },
    series: data,
    plotOptions: {
      series: {
          cursor: 'pointer',
          point: {
              events: {
                  click: function(event) {
                    props.onClick(event.point.category)
                  }
              }
          }
      }
      },
    exporting: {
      enabled: props.options,
      chartOptions: {
        title: {
          style: {
            fontSize: "10px",
          },
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              style: {
                fontSize: "6px",
              },
            },
          },
        },
      },
      scale: 4,
      fallbackToExportServer: false,
      buttons: {
        contextButton: {
          symbol: "download",
        },
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default TrendAnalysisLineChart;
