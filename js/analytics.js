export function getExpenseBreakdown(transactions) {

  const grouped = {};

  transactions
    .filter(t => t.type === 'expense')
    .forEach((transaction) => {

      const key = transaction.category;

      if (!grouped[key]) {
        grouped[key] = 0;
      }

      grouped[key] += transaction.amount;
    });

  return grouped;
}

export function getCashflowTrend(transactions) {

  const trend = [];

  for (let i = 6; i >= 0; i--) {

    const date = new Date();

    date.setDate(date.getDate() - i);

    const day = date.toLocaleDateString([], {
      weekday: 'short'
    });

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {

      const txDate = new Date(
        transaction.createdAt
      ).toDateString();

      if (txDate === date.toDateString()) {

        if (transaction.type === 'income') {
          income += transaction.amount;
        } else {
          expense += transaction.amount;
        }

      }

    });

    trend.push({
      day,
      income,
      expense
    });

  }

  return trend;
}

export function getMonthlyStats(transactions) {

  const now = new Date();

  let income = 0;
  let expense = 0;

  transactions.forEach((transaction) => {

    const txDate = new Date(transaction.createdAt);

    if (
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear()
    ) {

      if (transaction.type === 'income') {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
      }

    }

  });

  return {
    income,
    expense,
    savings: income - expense
  };
}