const STORAGE_KEY = 'finance_tracker_v1';

export function getTransactions() {
  return JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  ) || [];
}

export function saveTransactions(data) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

export function addTransaction(transaction) {
  const transactions = getTransactions();

  transactions.unshift(transaction);

  saveTransactions(transactions);

  return transactions;
}

export function clearTransactions() {
  localStorage.removeItem(STORAGE_KEY);
}