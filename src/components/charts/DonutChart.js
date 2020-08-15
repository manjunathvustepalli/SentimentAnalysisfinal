import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require('highcharts/modules/exporting')(Highcharts);


function DonutChart(props) {
  let data = props.mood
    ? [
        ["Happy", 44.2],
        ["Sad", 26.6],
        ["Anger", 20],
        ["Anticipation", 5],
        ["Disgust", 40],
        ["Surprise", 60],
        ["Fear", 10],
        ["Trust", 35],
      ]
    : [
        ["negative", 44.2],
        ["positive", 26.6],
        ["neutral", 20],
      ];
  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "pie chart",
    },
    plotOptions: {
      pie: {
        innerSize: "80%",
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          distance: -50,
        },
      },
    },
    series: [
      {
        data,
      },
    ],
    exporting: {
      chartOptions: {
          plotOptions: {
              series: {
                  dataLabels: {
                      enabled: true
                  }
                  
              }
          }
      },
      scale: 3,
      fallbackToExportServer: false
  },
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default DonutChart;
