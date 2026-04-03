import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const rankingsCollection = collection(db, "rankings");

export function subscribeToRankings(callback) {
  return onSnapshot(rankingsCollection, (snapshot) => {
    const rankings = snapshot.docs.map((docItem) => ({
      ...docItem.data(),
      id: docItem.id,
    }));

    callback(rankings);
  });
}

export async function addRankingToFirestore(rankingData) {
  const { id, ...cleanRankingData } = rankingData;

  const docRef = await addDoc(rankingsCollection, {
    ...cleanRankingData,
    localId: id || Date.now(),
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

export async function updateRankingInFirestore(rankingId, updates) {
  const { id, ...cleanUpdates } = updates || {};
  const rankingRef = doc(db, "rankings", String(rankingId));
  await updateDoc(rankingRef, cleanUpdates);
}

export async function deleteRankingFromFirestore(rankingId) {
  const rankingRef = doc(db, "rankings", String(rankingId));
  await deleteDoc(rankingRef);
}