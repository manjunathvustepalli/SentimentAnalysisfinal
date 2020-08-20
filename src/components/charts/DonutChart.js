import React from "react";
import highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
require('highcharts/modules/exporting')(highcharts);


function DonutChart(props) {

    const data = props.data || [['negative',16],['positive',11],['neutral',30]]
    const options = {
      chart: {
        type: "pie",
      },
      title: {
        text: props.heading || '',
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
          name:"pie",
          data
        }
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
    },
    }

  return <HighchartsReact highcharts={highcharts} options={options} />
}

export default DonutChart;