import React from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


function DonutChart() {
        const options = {
            chart: { 
                type: 'pie'
            },
            title: {
              text: 'pie chart'
            },
            plotOptions: {
              pie: {
                  innerSize: '80%',
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      distance: -50,
                  }
              }
          },
            colors: ['rgba(255,0,0,0.8)','rgb(0,255,0,0.6)','rgba(235,255,0,0.1)'],
            series: [{
                data: [
                    ['negative', 44.2],
                    ['positive', 26.6],
                    ['neutral', 20]
                    ]}]  
    }
          return(
            <div>
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
            />
          </div>
          )
    }

export default DonutChart
