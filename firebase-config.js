import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0r0i3mIE-q44SNh08kpW1wQozxR2nVak",
  authDomain: "finance-tracker-shashank.firebaseapp.com",
  projectId: "finance-tracker-shashank",
  storageBucket: "finance-tracker-shashank.firebasestorage.app",
  messagingSenderId: "738257758917",
  appId: "1:738257758917:web:0937de929900986e8e1eac",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
