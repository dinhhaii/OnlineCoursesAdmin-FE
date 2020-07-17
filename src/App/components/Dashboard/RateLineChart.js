import React from 'react';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const moment = require('moment');

class RateLineChart extends React.Component {

  render() {

    const { allSurveys } = this.props;

    const data = [0, 0, 0, 0, 0, 0,
                  0, 0 ,0 ,0 ,0 ,0 ];

    for (let survey of allSurveys) {
      let month = moment(survey.createdAt).month();
      data[month] += survey.rate;
    }

    const options = {
      title: {
        text: 'Rates'
      },

      subtitle: {
        text: `App Rates from User in ${moment().year()}`
      },

      yAxis: {
        title: {
          text: 'Users'
        }
      },

      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          }
        }
      },

      series: [
        {
          name: 'Star',
          data: data,
          color: 'blue'
        }
      ],

      credits: {
          enabled: false
      },

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    };

    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    )
  }
}

export default RateLineChart;
