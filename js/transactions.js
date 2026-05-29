import { addTransaction } from "./storage.js";

export function createTransaction(data) {

  return {

    type: data.type,

    category: data.category,

    icon: data.icon,

    amount: Number(data.amount),

    note: data.note || "",

    location: data.location || "",

    date: data.date,

    createdAt: new Date().toISOString(),

  };
}

export async function saveTransaction(data) {

  const transaction =
    createTransaction(data);

  return await addTransaction(
    transaction
  );
}

export function calculateTotals(transactions) {

  let income = 0;

  let expense = 0;

  transactions.forEach((transaction) => {

    if (!transaction) return;

    if (transaction.type === "income") {

      income += transaction.amount;

    } else {

      expense += transaction.amount;
    }
  });

  return {

    income,

    expense,

    balance: income - expense,

  };
}