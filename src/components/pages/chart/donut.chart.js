import React from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


function DonutChart() {
        const options = {
            chart: { 
                type: 'pie'
            },
            title: {
              text: ''
            },
            plotOptions: {
                pie: {
                    innerSize: '60%'
                }
            },
            series: [{
                data: [
                    ['44.2', 44.2],
                    ['26.6', 26.6],
                    ['20', 20],
                    ['3.1', 3.1],
                    ['5.4', 5.4]
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
