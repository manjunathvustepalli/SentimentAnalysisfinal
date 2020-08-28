import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function DemographyAgeChart() {
  let config = {
    chart: {
      type: "areaspline",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: [
        "14-06-2020",
        "15-06-2020",
        "16-06-2020",
        "17-06-2020",
        "18-6-2020",
        "19-6-2020",
      ],
      tickmarkPlacement: "on",
      title: {
        enabled: false,
      },
    },
    yAxis: {
      title: {
        text: "Billions",
      },
      labels: {
        formatter: function () {
          return this.value / 1000;
        },
      },
    },
    colors: [
      "rgba(52, 235, 232,0.5)",
      "rgba(255, 129, 61)",
      "rgba(230, 48, 78,0.5)",
    ],
    plotOptions: {
      area: {
        marker: {
          enabled: false,
          symbol: "circle",
          radius: 2,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    series: [
      {
        name: "Happy",
        data: [1000, 1000, 3000, 5000, 2000, 500],
      },
      {
        name: "Sad",
        data: [0, 450, 1200, 4600, 2000, 3000],
      },
      {
        name: "Anger",
        data: [0, 300, 200, 100, 3000, 1500],
      },
    ],
  };
  return <HighchartsReact options={config} > </HighchartsReact>;
}

export default DemographyAgeChart;
