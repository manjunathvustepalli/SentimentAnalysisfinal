import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";

function TrendAnalysisChart(props) {

  const [ series,dates ] = props.data
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
        'L', x  + w, y + h * 0.9
    ];
    return path;
};

  const options = {
    chart: {
      type: "column",
      
        height: props.height || "60%",

    },
    title: {
      text: props.title || "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      categories: dates,
      crosshair: true,
      title: {
        text: "Dates",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Data",
      },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      chartOptions: {
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
            },
          },
        },
      },
      scale: 1,
      fallbackToExportServer: false,
      buttons: {
        contextButton: {
          symbol: "download",
        },
      },
    },
    colors: [
      "rgba(3, 240, 252)",
      "rgba(252, 3, 65)",
      "rgba(10, 63, 168)",
      "rgba(10, 168, 31)",
    ],
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span><b>{point.y}',
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
        stacking: props.stacking || "",
      },
    },
    series,
    buttons: {
      contextButton: {
        symbol: "download",
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default TrendAnalysisChart;
