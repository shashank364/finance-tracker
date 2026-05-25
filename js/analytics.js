export function getExpenseBreakdown(transactions) {
  const grouped = {};

  transactions
    .filter((t) => t.type === "expense")
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
      weekday: "short",
    });

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      const txDate = new Date(transaction.createdAt).toDateString();

      if (txDate === date.toDateString()) {
        if (transaction.type === "income") {
          income += transaction.amount;
        } else {
          expense += transaction.amount;
        }
      }
    });

    trend.push({
      day,
      income,
      expense,
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
      if (transaction.type === "income") {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
      }
    }
  });

  return {
    income,
    expense,
    savings: income - expense,
  };
}

export function generateInsight(transactions) {
  if (transactions.length === 0) {
    return {
      title: "No Insights Yet",
      message: "Start tracking transactions to unlock analytics.",
    };
  }

  let topCategory = "";
  let highest = 0;

  const grouped = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((transaction) => {
      if (!grouped[transaction.category]) {
        grouped[transaction.category] = 0;
      }

      grouped[transaction.category] += transaction.amount;
    });

  Object.entries(grouped).forEach(([category, amount]) => {
    if (amount > highest) {
      highest = amount;
      topCategory = category;
    }
  });

  return {
    title: `${topCategory} Spending Spike`,

    message: `You've spent ₹${highest} on ${topCategory}. This is currently your highest expense category.`,
  };
}
