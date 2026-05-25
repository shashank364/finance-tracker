import {
  expenseCategories,
  incomeCategories
} from './categories.js';

import {
  getTransactions,
  saveTransactions
} from './storage.js';

import {
  saveTransaction,
  calculateTotals
} from './transactions.js';

import {
  getExpenseBreakdown,
  getCashflowTrend
} from './analytics.js';

import {
  renderExpenseChart,
  renderCashflowChart
} from './charts.js';

const modal =
  document.getElementById('transactionModal');

const addBtn =
  document.getElementById('addTransactionBtn');

const saveBtn =
  document.getElementById('saveTransactionBtn');

const categorySelect =
  document.getElementById('categorySelect');

const transactionList =
  document.getElementById('transactionList');

const typeButtons =
  document.querySelectorAll('.type');

let selectedType = 'expense';

let transactions = getTransactions();

function populateCategories(type) {

  categorySelect.innerHTML = '';

  const categories =
    type === 'expense'
      ? expenseCategories
      : incomeCategories;

  categories.forEach((category) => {

    const option =
      document.createElement('option');

    option.value = category.name;

    option.innerText =
      `${category.icon} ${category.name}`;

    option.dataset.icon =
      category.icon;

    categorySelect.appendChild(option);

  });

}

function openModal() {
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

addBtn.onclick = openModal;

modal.onclick = (e) => {

  if (e.target === modal) {
    closeModal();
  }

};

typeButtons.forEach((button) => {

  button.onclick = () => {

    typeButtons.forEach((btn) => {
      btn.classList.remove('active');
    });

    button.classList.add('active');

    selectedType =
      button.dataset.type;

    populateCategories(selectedType);

  };

});

function renderTransactions() {

  transactionList.innerHTML = '';

  transactions.forEach((transaction) => {

    const item =
      document.createElement('div');

    item.className =
      'transaction-item';

    item.innerHTML = `
      <div class="transaction-left">

        <div class="transaction-icon">
          ${transaction.icon}
        </div>

        <div>

          <div class="transaction-category">
            ${transaction.category}
          </div>

          <div class="transaction-meta">
            ${transaction.note || 'Transaction'}
            ${transaction.location
              ? ' · ' + transaction.location
              : ''}
          </div>

        </div>

      </div>

      <div class="
        transaction-amount
        ${transaction.type}
      ">
        ${transaction.type === 'income'
          ? '+'
          : '-'
        }₹${transaction.amount}
      </div>
    `;

    transactionList.appendChild(item);

  });

}

function renderDashboard() {

  const totals =
    calculateTotals(transactions);

  document.getElementById(
    'balanceAmount'
  ).innerText =
    `₹${totals.balance}`;

  document.getElementById(
    'incomeAmount'
  ).innerText =
    `₹${totals.income}`;

  document.getElementById(
    'expenseAmount'
  ).innerText =
    `₹${totals.expense}`;

  renderTransactions();

  renderExpenseChart(
    getExpenseBreakdown(transactions)
  );

  renderCashflowChart(
    getCashflowTrend(transactions)
  );

}

saveBtn.onclick = () => {

  const amount =
    document.getElementById('amountInput')
      .value;

  const note =
    document.getElementById('noteInput')
      .value;

  const location =
    document.getElementById('locationInput')
      .value;

  const selectedOption =
    categorySelect.options[
      categorySelect.selectedIndex
    ];

  const transaction =
    saveTransaction({

      type: selectedType,

      category:
        selectedOption.value,

      icon:
        selectedOption.dataset.icon,

      amount,

      note,

      location

    });

  transactions = transaction;

  renderDashboard();

  closeModal();

};

populateCategories(selectedType);

renderDashboard();

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register(
    './service-worker.js'
  );

}