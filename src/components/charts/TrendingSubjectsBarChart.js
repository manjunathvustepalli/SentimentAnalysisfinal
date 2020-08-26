import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";

function TrendingSubjectsBarChart(props) {
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
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "",
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
          format: "{point.y:.1f}%",
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
    },

    series: [
      {
        name: "Words",
        colorByPoint: true,
        data: [
          {
            name: "#Covid-19",
            y: 62.74,
          },
          {
            name: "#Deaths",
            y: 10.57,
          },
          {
            name: "#Monsoon",
            y: 7.23,
          },
          {
            name: "#India",
            y: 5.58,
          },
          {
            name: "#Dakha",
            y: 4.02,
          },
          {
            name: "#Sheikh Hasinad",
            y: 1.92,
          },
          {
            name: "#Oxford",
            y: 1.92,
          },
          {
            name: "#Hospital",
            y: 1.92,
          },
          {
            name: "#Expot",
            y: 1.92,
          },
          {
            name: "#Vaccine",
            y: 1.92,
          },
        ],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default TrendingSubjectsBarChart;
