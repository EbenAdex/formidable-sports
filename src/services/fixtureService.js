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

const fixturesCollection = collection(db, "fixtures");

export async function fetchFixturesOnce() {
  const snapshot = await getDocs(fixturesCollection);

  return snapshot.docs.map((docItem) => ({
    ...docItem.data(),
    id: docItem.id,
  }));
}

export function subscribeToFixtures(callback) {
  return onSnapshot(fixturesCollection, (snapshot) => {
    const fixtures = snapshot.docs.map((docItem) => ({
      ...docItem.data(),
      id: docItem.id,
    }));

    callback(fixtures);
  });
}

export async function addFixtureToFirestore(fixtureData) {
  const { id, ...cleanFixtureData } = fixtureData;

  const docRef = await addDoc(fixturesCollection, {
    ...cleanFixtureData,
    localId: id || Date.now(),
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

export async function updateFixtureInFirestore(fixtureId, updates) {
  const { id, ...cleanUpdates } = updates || {};
  const fixtureRef = doc(db, "fixtures", String(fixtureId));
  await updateDoc(fixtureRef, cleanUpdates);
}

export async function deleteFixtureFromFirestore(fixtureId) {
  const fixtureRef = doc(db, "fixtures", String(fixtureId));
  await deleteDoc(fixtureRef);
}