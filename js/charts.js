let donutChart;
let cashflowChart;

export function renderExpenseChart(data) {

  const ctx = document
    .getElementById('expenseDonut');

  const labels = Object.keys(data);

  const values = Object.values(data);

  if (donutChart) {
    donutChart.destroy();
  }

  donutChart = new Chart(ctx, {

    type: 'doughnut',

    data: {
      labels,

      datasets: [
        {
          data: values,

          backgroundColor: [
            '#69F58C',
            '#5DA9FF',
            '#FFB84D',
            '#FF6B9D',
            '#B388FF',
            '#FF6B6B',
            '#4DD0E1',
            '#9575CD'
          ],

          borderWidth: 0
        }
      ]
    },

    options: {

      responsive: true,

      plugins: {

        legend: {
          labels: {
            color: 'white'
          }
        }

      }

    }

  });

}

export function renderCashflowChart(data) {

  const ctx = document
    .getElementById('cashflowChart');

  if (cashflowChart) {
    cashflowChart.destroy();
  }

  cashflowChart = new Chart(ctx, {

    type: 'line',

    data: {

      labels: data.map(d => d.day),

      datasets: [

        {
          label: 'Income',

          data: data.map(d => d.income),

          borderColor: '#69F58C',

          backgroundColor: 'rgba(105,245,140,0.2)',

          tension: 0.4,

          fill: true
        },

        {
          label: 'Expense',

          data: data.map(d => d.expense),

          borderColor: '#FF6B6B',

          backgroundColor: 'rgba(255,107,107,0.2)',

          tension: 0.4,

          fill: true
        }

      ]

    },

    options: {

      responsive: true,

      plugins: {

        legend: {
          labels: {
            color: 'white'
          }
        }

      },

      scales: {

        x: {
          ticks: {
            color: '#8C8C8C'
          },

          grid: {
            color: 'rgba(255,255,255,0.05)'
          }
        },

        y: {
          ticks: {
            color: '#8C8C8C'
          },

          grid: {
            color: 'rgba(255,255,255,0.05)'
          }
        }

      }

    }

  });

}