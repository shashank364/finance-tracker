import "../css/app.css";
import "../css/dashboard.css";
import "../css/analytics.css";
import "../css/modal.css";

import { expenseCategories, incomeCategories } from "./categories.js";

import { getTransactions, saveTransactions } from "./storage.js";

import { saveTransaction, calculateTotals } from "./transactions.js";

import {
  getExpenseBreakdown,
  getCashflowTrend,
  generateInsight,
} from "./analytics.js";

import { renderExpenseChart, renderCashflowChart } from "./charts.js";

import { auth, db } from "../firebase-config.js";

import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const provider = new GoogleAuthProvider();

let currentUser = null;

let authMode = "login";

const modal = document.getElementById("transactionModal");

const addBtn = document.getElementById("addTransactionBtn");

const saveBtn = document.getElementById("saveTransactionBtn");

const categorySelect = document.getElementById("categorySelect");

const transactionList = document.getElementById("transactionList");

const typeButtons = document.querySelectorAll(".type");

let selectedType = "expense";

let transactions = getTransactions();

async function saveToCloud(transaction) {
  if (!currentUser) return;

  try {
    await addDoc(collection(db, "transactions"), {
      ...transaction,
      userId: currentUser.uid,
    });

    console.log("Saved to Firestore");
  } catch (error) {
    console.error(error);
  }
}

function populateCategories(type) {
  categorySelect.innerHTML = "";

  const categories = type === "expense" ? expenseCategories : incomeCategories;

  categories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category.name;

    option.innerText = `${category.icon} ${category.name}`;

    option.dataset.icon = category.icon;

    categorySelect.appendChild(option);
  });
}

function openModal() {
  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
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
      btn.classList.remove("active");
    });

    button.classList.add("active");

    selectedType = button.dataset.type;

    populateCategories(selectedType);
  };
});

function renderTransactions() {
  transactionList.innerHTML = "";
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  sortedTransactions.forEach((transaction) => {
    const item = document.createElement("div");

    item.className = "transaction-item";

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
            ${transaction.note || "Transaction"}
            ${transaction.location ? " · " + transaction.location : ""}
          </div>

        </div>

      </div>

      <div class="
        transaction-amount
        ${transaction.type}
      ">
        ${transaction.type === "income" ? "+" : "-"}₹${transaction.amount}
      </div>
    `;

    transactionList.appendChild(item);
  });
}

function renderDashboard() {
  const totals = calculateTotals(transactions);

  document.getElementById("balanceAmount").innerText = `₹${totals.balance}`;

  document.getElementById("incomeAmount").innerText = `₹${totals.income}`;

  document.getElementById("expenseAmount").innerText = `₹${totals.expense}`;

  renderTransactions();

  renderCashflowChart(getCashflowTrend(transactions));
  const insight = generateInsight(transactions);

  document.getElementById("insightTitle").innerText = insight.title;

  document.getElementById("insightValue").innerText = insight.message;

  document.getElementById("profileTransactions").innerText =
    transactions.length;

  document.getElementById("profileBalance").innerText = `₹${totals.balance}`;

  renderProfile();
  const currentMonth = new Date().getMonth();

  let monthlyExpense = 0;

  transactions.forEach((tx) => {
    if (!tx.date) return;

    const txDate = new Date(tx.date);

    if (tx.type === "expense" && txDate.getMonth() === currentMonth) {
      monthlyExpense += Number(tx.amount) || 0;
    }
  });

  document.getElementById("monthlySpend").innerText =
    `₹${monthlyExpense.toLocaleString()}`;

  document.getElementById("transactionCount").innerText = transactions.length;

  const miniList = document.getElementById("miniActivityList");

  miniList.innerHTML = "";

  transactions
    .slice(-3)
    .reverse()
    .forEach((tx) => {
      miniList.innerHTML += `

  <div class="mini-activity-item">

    <div class="mini-left">

      <div class="mini-icon">
        ${tx.icon || "💸"}
      </div>

      <div class="mini-info">

        <div class="mini-title">
          ${tx.category}
        </div>

        <div class="mini-sub">
          ${tx.note || "No note"}
        </div>

      </div>

    </div>

    <strong class="mini-amount">

      ₹${Number(tx.amount).toLocaleString()}

    </strong>

  </div>

`;
    });
}

function renderProfile() {
  if (!currentUser) return;

  document.getElementById("profileEmail").innerText =
    currentUser.email || "Google User";

  document.getElementById("profileName").innerText =
    currentUser.displayName || "User";

  document.getElementById("profileAvatar").innerText =
    (currentUser.displayName || currentUser.email || "U")[0].toUpperCase();

  document.getElementById("profileTransactions").innerText =
    transactions.length;

  const totals = calculateTotals(transactions);

  document.getElementById("profileBalance").innerText = `₹${totals.balance}`;
}

saveBtn.onclick = () => {
  const amount = document.getElementById("amountInput").value;

  const note = document.getElementById("noteInput").value;

  const location = document.getElementById("locationInput").value;

  const selectedOption = categorySelect.options[categorySelect.selectedIndex];

  const transaction = {
    type: selectedType,

    category: selectedOption.value,

    icon: selectedOption.dataset.icon,

    amount: Number(amount),

    note,

    location,

    date: new Date().toISOString(),
  };

  transactions.push(transaction);

  saveToCloud(transaction);

  renderDashboard();

  closeModal();
};
populateCategories(selectedType);

renderDashboard();

if ("serviceWorker" in navigator) {
navigator.serviceWorker.register(
  '/finance-tracker/service-worker.js'
);
}

async function login() {
  try {
    const result = await signInWithPopup(auth, provider);

    currentUser = result.user;

    showApp();

    console.log("Authenticated:", currentUser.uid);

    loadCloudTransactions();
  } catch (error) {
    console.error(error);
  }
}

async function loadCloudTransactions() {
  if (!currentUser) return;

  try {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", currentUser.uid),
    );

    const snapshot = await getDocs(q);

    transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    renderDashboard();

    console.log("Cloud transactions loaded");
  } catch (error) {
    console.error(error);
  }
}

async function emailLogin() {
  const email = document.getElementById("emailInput").value;

  const password = document.getElementById("passwordInput").value;

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    currentUser = result.user;

    showApp();

    loadCloudTransactions();
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
}

async function signup() {
  const email = document.getElementById("emailInput").value;

  const password = document.getElementById("passwordInput").value;

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    currentUser = result.user;

    showApp();
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
}

function showApp() {
  document.getElementById("authScreen").classList.add("hidden");

  document.getElementById("app").classList.remove("hidden");

  renderProfile();

  const rawName =
    currentUser.displayName || currentUser.email?.split("@")[0] || "User";

  const firstName = rawName
    .split(/[._\-\s]+/)[0]
    .replace(/^./, (char) => char.toUpperCase());

  document.getElementById("welcomeText").innerText =
    `Welcome back, ${firstName}`;

  document.getElementById("heroTitle").innerText =
    `${firstName}'s Finance Tracker`;

  document.getElementById("bottomNav").classList.add("show-nav");
}

onAuthStateChanged(auth, (user) => {
  document.getElementById("appLoader").style.display = "none";

  if (user) {
    currentUser = user;

    showApp();

    loadCloudTransactions();
  } else {
    currentUser = null;

    document.getElementById("app").classList.add("hidden");

    document.getElementById("authScreen").classList.remove("hidden");
  }
});

const loginBtn = document.getElementById("googleLoginBtn");

loginBtn.onclick = login;

document.getElementById("googleLoginBtn").onclick = login;

const authActionBtn = document.getElementById("authActionBtn");

const authSwitch = document.getElementById("authSwitch");

authSwitch.onclick = () => {
  if (authMode === "login") {
    authMode = "signup";

    authActionBtn.innerText = "Create Account";

    authSwitch.innerText = "Already have an account? Login";
  } else {
    authMode = "login";

    authActionBtn.innerText = "Login";

    authSwitch.innerText = "Don't have an account? Sign up";
  }
};

authActionBtn.onclick = () => {
  if (authMode === "login") {
    emailLogin();
  } else {
    signup();
  }
};

document.getElementById("logoutBtn").onclick = async () => {
  await signOut(auth);
  document.getElementById("bottomNav").classList.remove("show-nav");
  currentUser = null;

  transactions = [];

  document.getElementById("app").classList.add("hidden");

  document.getElementById("authScreen").classList.remove("hidden");
};
const navItems = document.querySelectorAll(".nav-item");

const screens = {
  home: document.getElementById("homeScreen"),

  analytics: document.getElementById("analyticsScreen"),

  transactions: document.getElementById("transactionsScreen"),

  profile: document.getElementById("profileScreen"),
};

navItems.forEach((item) => {
  item.onclick = () => {
    navItems.forEach((nav) => {
      nav.classList.remove("active");
    });

    item.classList.add("active");

    Object.values(screens).forEach((screen) => {
      screen.classList.remove("active-screen");
    });

    screens[item.dataset.tab].classList.add("active-screen");

    if (item.dataset.tab === "analytics") {
      setTimeout(() => {
        renderExpenseChart(transactions);

        renderCashflowChart(transactions);
      }, 50);
    }
  };
});
