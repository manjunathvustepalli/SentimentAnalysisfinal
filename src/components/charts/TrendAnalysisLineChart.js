import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";

function TrendAnalysisLineChart(props) {
  const options = {
    title: {
      text: "",
    },

    subtitle: {
      text: "",
    },

    yAxis: {
      title: {
        text: "Data (%)",
      },
    },

    xAxis: {
      title: {
        text: "Weekly Report | June 2020",
      },
      accessibility: {
        rangeDescription: "Range: 2010 to 2017",
      },
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    colors: ["rgba(36, 170, 214)", "rgba(252, 3, 65)"],
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2010,
      },
    },

    series: [
      {
        name: "Bangla",
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
      },
      {
        name: "English",
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
      },
    ],

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
