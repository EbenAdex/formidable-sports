import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const resultsCollection = collection(db, "results");

export function subscribeToResults(callback) {
  const q = query(resultsCollection, orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    callback(results);
  });
}

export async function addResultToFirestore(result) {
  await addDoc(resultsCollection, result);
}

export async function updateResultInFirestore(id, updates) {
  const resultRef = doc(db, "results", id);
  await updateDoc(resultRef, updates);
}

export async function deleteResultFromFirestore(id) {
  const resultRef = doc(db, "results", id);
  await deleteDoc(resultRef);
}