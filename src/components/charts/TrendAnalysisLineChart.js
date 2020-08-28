import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";

function TrendAnalysisLineChart(props) {

  const { dates,data } = props

  const options = {
    title: {
      text: "",
    },
    yAxis: {
      title: {
        text: "Data",
      },
    },
    xAxis: {
      categories: dates,
      crosshair: true,
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    credits: {
      enabled: false
  },
    series: data
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default TrendAnalysisLineChart;
