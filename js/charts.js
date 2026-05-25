let donutChart;
let cashflowChart;

export function renderExpenseChart(transactions) {
  const canvas = document.getElementById("expenseDonut");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const expenseTransactions = transactions.filter(
    (tx) => tx.type === "expense",
  );

  const grouped = {};

  expenseTransactions.forEach((tx) => {
    if (!grouped[tx.category]) {
      grouped[tx.category] = 0;
    }

    grouped[tx.category] += Number(tx.amount) || 0;
  });

  const labels = Object.keys(grouped);

  const values = Object.values(grouped);

  if (donutChart && typeof donutChart.destroy === "function") {
    donutChart.destroy();
  }

  donutChart = new Chart(ctx, {
    type: "doughnut",

    data: {
      labels,

      datasets: [
        {
          data: values,

          backgroundColor: [
            "#69F58C",
            "#5DA9FF",
            "#FFB84D",
            "#FF6B9D",
            "#B388FF",
            "#FF6B6B",
            "#4DD0E1",
            "#9575CD",
          ],

          borderWidth: 0,

          borderRadius: 8,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      cutout: "72%",

      animation: {
        animateRotate: true,

        duration: 1200,
      },

      plugins: {
        legend: {
          position: "top",

          labels: {
            color: "white",

            padding: 18,

            usePointStyle: true,

            pointStyle: "circle",
          },
        },

        tooltip: {
          backgroundColor: "#111",

          borderColor: "rgba(255,255,255,0.08)",

          borderWidth: 1,

          padding: 14,

          cornerRadius: 14,

          titleColor: "#fff",

          bodyColor: "#fff",

          callbacks: {
            label: function (context) {
              return `₹${context.raw.toLocaleString()}`;
            },
          },
        },
      },
    },
  });
}

export function renderCashflowChart(transactions) {
  const canvas = document.getElementById("cashflowChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (cashflowChart && typeof cashflowChart.destroy === "function") {
    cashflowChart.destroy();
  }

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const incomeData = [0, 0, 0, 0, 0, 0, 0];

  const expenseData = [0, 0, 0, 0, 0, 0, 0];

  transactions.forEach((tx) => {
    if (!tx.date) return;

    const date = new Date(tx.date);

    let day = date.getDay();

    day = day === 0 ? 6 : day - 1;

    const amount = Number(tx.amount) || 0;

    if (tx.type === "income") {
      incomeData[day] += amount;
    } else {
      expenseData[day] += amount;
    }
  });

  cashflowChart = new Chart(ctx, {
    type: "line",

    data: {
      labels,

      datasets: [
        {
          label: "Income",

          data: incomeData,

          borderColor: "#69F58C",

          backgroundColor: "rgba(105,245,140,0.12)",

          borderWidth: 3,

          tension: 0.45,

          pointRadius: 4,

          pointHoverRadius: 8,

          pointHitRadius: 20,

          fill: true,
        },

        {
          label: "Expense",

          data: expenseData,

          borderColor: "#FF6B6B",

          backgroundColor: "rgba(255,107,107,0.12)",

          borderWidth: 3,

          tension: 0.45,

          pointRadius: 4,

          pointHoverRadius: 8,

          pointHitRadius: 20,

          fill: true,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,
      interaction: {
        mode: "index",

        intersect: false,
      },
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },

        tooltip: {
          backgroundColor: "#111",

          borderColor: "rgba(255,255,255,0.08)",

          borderWidth: 1,

          padding: 14,

          cornerRadius: 14,

          titleColor: "#fff",

          bodyColor: "#fff",

          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ₹${context.raw.toLocaleString()}`;
            },
          },
        },
      },

      scales: {
        x: {
          ticks: {
            color: "#aaa",
          },

          grid: {
            display: false,
          },
        },

        y: {
          beginAtZero: true,

          ticks: {
            color: "#aaa",
          },

          grid: {
            color: "rgba(255,255,255,0.05)",
          },
        },
      },
    },
  });
}
