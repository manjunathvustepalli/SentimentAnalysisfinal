import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function BarChart(props) {
  Highcharts.SVGRenderer.prototype.symbols.download = function (x, y, w, h) {
    var path = [
        'M', x + w * 0.5, y,
        'L', x + w * 0.5, y + h * 0.7,
        'M', x + w * 0.3, y + h * 0.5,
        'L', x + w * 0.5, y + h * 0.7,
        'L', x + w * 0.7, y + h * 0.5,
        'M', x, y + h * 0.9,
        'L', x, y + h,
        'L', x + w, y + h,
        'L', x + w, y + h * 0.9
    ];
    return path;
};
  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: props.title || '',
    },
    subtitle: {
      text: "",
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    credits: {
      enabled: false
  },
    xAxis: {
      type: "category",
      categories:props.categories,
      title:{
        text:'Dates',
      }
    },
    yAxis: {
      title: {
        text: "data",
      },
    },
    legend: {
      enabled: true,
    },
    plotOptions: {
      column:{
        stacking:props.stacking || ''
      },
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: false,
          format: "{point.y}",
          style: {
            fontWeight: 'bold',
            color: 'black',
            fontSize:'0.8rem',
            textOutline:'none',
            border:'none'
          },
        },
      },
    },
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
      fallbackToExportServer: false,
      buttons: {
          contextButton: {
              symbol: 'download'
          }
      }
  },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span><b>{point.y}',
    },

    series: props.data
  };

  return(
      <HighchartsReact highcharts={Highcharts} options={options} />
  )
}

export default BarChart;
