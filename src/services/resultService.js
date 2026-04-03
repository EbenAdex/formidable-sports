import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const resultsCollection = collection(db, "results");

export async function fetchResultsOnce() {
  const snapshot = await getDocs(resultsCollection);

  return snapshot.docs.map((docItem) => ({
    ...docItem.data(),
    id: docItem.id,
  }));
}

export function subscribeToResults(callback) {
  return onSnapshot(resultsCollection, (snapshot) => {
    const results = snapshot.docs.map((docItem) => ({
      ...docItem.data(),
      id: docItem.id,
    }));

    callback(results);
  });
}

export async function addResultToFirestore(resultData) {
  const { id, ...cleanResultData } = resultData;

  const docRef = await addDoc(resultsCollection, {
    ...cleanResultData,
    localId: id || Date.now(),
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

export async function updateResultInFirestore(resultId, updates) {
  const { id, ...cleanUpdates } = updates || {};
  const resultRef = doc(db, "results", String(resultId));
  await updateDoc(resultRef, cleanUpdates);
}

export async function deleteResultFromFirestore(resultId) {
  const resultRef = doc(db, "results", String(resultId));
  await deleteDoc(resultRef);
}