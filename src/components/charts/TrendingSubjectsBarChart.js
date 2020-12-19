import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";

function TrendingSubjectsBarChart(props) {
  Highcharts.SVGRenderer.prototype.symbols.download = function (x, y, w, h) {
    var path = [
      "M",
      x + w * 0.5,
      y,
      "L",
      x + w * 0.5,
      y + h * 0.7,
      "M",
      x + w * 0.3,
      y + h * 0.5,
      "L",
      x + w * 0.5,
      y + h * 0.7,
      "L",
      x + w * 0.7,
      y + h * 0.5,
      "M",
      x,
      y + h * 0.9,
      "L",
      x,
      y + h,
      "L",
      x + w,
      y + h,
      "L",
      x + w,
      y + h * 0.9,
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
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "category",
      title: {
        text: "Keywords",
      },
    },
    yAxis: {
      title: {
        text: props.y || "data",
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y}",
        },
      },
    },
    exporting: {
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

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>, frequency : <b>{point.y}</b><br/>',
    },

    series: [
      {
        name: "Words",
        colorByPoint: true,
        data: props.data,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default TrendingSubjectsBarChart;
