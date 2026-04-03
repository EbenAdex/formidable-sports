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

const tablesCollection = collection(db, "tables");

export async function fetchTablesOnce() {
  const snapshot = await getDocs(tablesCollection);

  return snapshot.docs.map((docItem) => ({
    ...docItem.data(),
    id: docItem.id,
  }));
}

export function subscribeToTables(callback) {
  return onSnapshot(tablesCollection, (snapshot) => {
    const rows = snapshot.docs.map((docItem) => ({
      ...docItem.data(),
      id: docItem.id,
    }));

    callback(rows);
  });
}

export async function addTableRowToFirestore(rowData) {
  const { id, ...cleanRowData } = rowData;

  const docRef = await addDoc(tablesCollection, {
    ...cleanRowData,
    localId: id || Date.now(),
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

export async function updateTableRowInFirestore(rowId, updates) {
  const { id, ...cleanUpdates } = updates || {};
  const rowRef = doc(db, "tables", String(rowId));
  await updateDoc(rowRef, cleanUpdates);
}

export async function deleteTableRowFromFirestore(rowId) {
  const rowRef = doc(db, "tables", String(rowId));
  await deleteDoc(rowRef);
}