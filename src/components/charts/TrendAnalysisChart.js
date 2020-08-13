import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";

function TrendAnalysisChart(props) {
  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Data (%)",
      },
    },
    colors: [
      "rgba(3, 240, 252)",
      "rgba(252, 3, 65)",
      "rgba(10, 63, 168)",
      "rgba(10, 168, 31)",
    ],
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Twitter",
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6],
      },
      {
        name: "YouTube",
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0],
      },
      {
        name: "Facebook",
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0],
      },
      {
        name: "Others",
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default TrendAnalysisChart;
