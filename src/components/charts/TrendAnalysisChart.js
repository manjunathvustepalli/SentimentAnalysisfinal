import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";

function TrendAnalysisChart(props) {

  const [ series,dates ] = props.data

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
      categories: dates,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Data (%)",
      },
    },
    credits: {
      enabled: false
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
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
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
    series
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default TrendAnalysisChart;
