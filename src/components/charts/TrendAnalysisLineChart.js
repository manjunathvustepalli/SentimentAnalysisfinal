import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";

function TrendAnalysisLineChart(props) {

  const { dates,data } = props

  const options = {
    title: {
      text: "Source wise language wise Trend of Posts",
    },
    yAxis: {
      title: {
        text: "Data (%)",
      },
    },
    xAxis: {
      categories: dates,
      crosshair: true,
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    series: data,
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default TrendAnalysisLineChart;
