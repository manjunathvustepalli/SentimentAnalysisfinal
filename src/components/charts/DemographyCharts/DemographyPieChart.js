import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function DemographyDonutChart(props) {
  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    credits: {
      enabled: false
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Brands",
        colorByPoint: true,
        data: [
          {
            name: "Service/Private",
            y: 61.41,
            sliced: true,
            selected: true,
          },
          {
            name: "Service/Govt",
            y: 10.85,
          },
          {
            name: "Self Employed",
            y: 4.67,
          },
          {
            name: "Farming",
            y: 4.18,
          },
          {
            name: "NRB",
            y: 1.64,
          },
          {
            name: "Retired/Unemployed",
            y: 1.6,
          },
        ],
      },
    ],
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default DemographyDonutChart;
