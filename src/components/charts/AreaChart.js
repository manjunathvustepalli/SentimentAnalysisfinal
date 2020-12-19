import React, { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
import colors from '../../helpers/colors';
import downloadIcon from '../../helpers/downloadIcon';
require('highcharts/modules/exporting')(Highcharts);


function AreaChart(props) {

    Highcharts.SVGRenderer.prototype.symbols.download = downloadIcon
    const [series, setseries] = useState([])

    useEffect(() => {
        let data = []
        if(!props.sorted){
            Object.keys(props.data).forEach(key => {
                if(key !== 'dates')
                    data.push({name:key,data:props.data[key],color:colors[key]})
            })
        } else {
            data = props.data
        }
        
        setseries(data)
    },[props.data])

    let config = {
      chart: {
        type: "areaspline",
        height: props.height||"60%",
      },
      title: {
        text: props.title || "",
      },
      xAxis: {
        categories: props.data.dates || props.dates,
        tickmarkPlacement: "on",
        title: {
          text: "Dates",
        },
      },
      yAxis: {
        title: {
          text: "Data",
        },
        labels: {
          formatter: function () {
            return this.value;
          },
        },
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        area: {
          marker: {
            enabled: true,
            symbol: "circle",
            radius: 2,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
          showInLegend: true,
        },
      },
      series,
      exporting: {
        chartOptions: {
          title: {
            style: {
              fontSize: "10px",
            },
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                style: {
                  fontSize: "6px",
                },
              },
            },
          },
        },
        scale: 4,
        fallbackToExportServer: false,
        buttons: {
          contextButton: {
            symbol: "download",
          },
        },
      },
    }; 
    return <HighchartsReact  options={config}> </HighchartsReact>
}

export default AreaChart
