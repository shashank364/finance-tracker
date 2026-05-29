import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase-config.js";

export async function getTransactions() {

  const user = auth.currentUser;

  if (!user) return [];

  const q = query(
    collection(db, "transactions"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

export async function saveTransactions(data) {
  return data;
}

export async function addTransaction(transaction) {

  const user = auth.currentUser;

  if (!user) return null;

  const payload = {
    ...transaction,
    userId: user.uid,
  };

  const docRef = await addDoc(
    collection(db, "transactions"),
    payload
  );

  return {
    id: docRef.id,
    ...payload,
  };
}

export async function editTransaction(id, data) {

  await updateDoc(
    doc(db, "transactions", id),
    data
  );

  return {
    id,
    ...data,
  };
}

export async function removeTransaction(id) {

  await deleteDoc(
    doc(db, "transactions", id)
  );

  return true;
}

export function clearTransactions() {
  return;
}