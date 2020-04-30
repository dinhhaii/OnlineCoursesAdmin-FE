import React from 'react';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const moment = require('moment');

class UserLineChart extends React.Component {

  render() {

    const { allUsers } = this.props;

    const localData = [0, 0, 0, 0, 0, 0,
                  0, 0 ,0 ,0 ,0 ,0 ];

    const facebookData = [0, 0, 0, 0, 0, 0,
                  0, 0 ,0 ,0 ,0 ,0 ];

    const googleData = [0, 0, 0, 0, 0, 0,
                  0, 0 ,0 ,0 ,0 ,0 ];

    for (let user of allUsers) {
      switch (user.type) {
        case 'local':
          localData[moment(user.createdAt).month() - 1] += 1;
          break;
        case 'facebook':
          facebookData[moment(user.createdAt).month() - 1] += 1;
          break;
        case 'google':
          googleData[moment(user.createdAt).month() - 1] += 1;
          break;
        default:

      }
    }

    const options = {
      title: {
        text: 'Users'
      },

      subtitle: {
        text: `Monthly Users Analytics in ${moment().year()}`
      },

      yAxis: {
        title: {
          text: 'Money ($)'
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
          name: 'Local',
          data: localData,
          color: 'purple'
        },
        {
          name: 'Google',
          data: googleData,
          color: 'red'
        },
        {
          name: 'Facebook',
          data: facebookData,
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

export default UserLineChart;
