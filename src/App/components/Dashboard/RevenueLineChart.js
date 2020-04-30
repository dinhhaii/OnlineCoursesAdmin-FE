import React from 'react';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const moment = require('moment');

class RevenueLineChart extends React.Component {

  render() {

    const { allInvoices } = this.props;

    const data = [0, 0, 0, 0, 0, 0,
                  0, 0 ,0 ,0 ,0 ,0 ];

    for (let invoice of allInvoices) {
      data[moment(allInvoices.payDay).month() - 1] += invoice.totalPrice;
    }

    const options = {
      title: {
        text: 'Revenue ($)'
      },

      subtitle: {
        text: `Monthly Revenue in ${moment().year()}`
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

      series: [{
        name: 'Profit',
        data: data,
        color: 'green'
      }],

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

export default RevenueLineChart;
