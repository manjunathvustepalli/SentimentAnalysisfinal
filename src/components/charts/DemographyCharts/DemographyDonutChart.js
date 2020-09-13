import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function DemographyDonutChart(props) {

  let data = props.data ? props.data: [
    ["", 35],
    ["", 65],
  ];
  const options = {
    chart: {
      type: "pie",
      height:'200px'
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
  exporting: {
    buttons: {
        contextButton: {
            enabled: false
        }
    }
},
    plotOptions: {
      pie: {
        innerSize: "80%",
        allowPointSelect: true,
        cursor: "pointer",
        showInLegend:'true',
        dataLabels: {
          enabled: true,
          distance: -10,
          style:{
            color:'black',
            textOutline:'none',
          }
        },
      },
    },
    colors: [props.color1, props.color2],
    series: [
      {
        data,
      },
    ],
  };
  return   <HighchartsReact highcharts={Highcharts} options={options} />
}

export default DemographyDonutChart;
