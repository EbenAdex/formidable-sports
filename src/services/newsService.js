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

const newsCollection = collection(db, "news");

export async function fetchNewsOnce() {
  const snapshot = await getDocs(newsCollection);

  return snapshot.docs.map((docItem) => ({
    ...docItem.data(),
    id: docItem.id,
  }));
}

export function subscribeToNews(callback) {
  return onSnapshot(newsCollection, (snapshot) => {
    const news = snapshot.docs.map((docItem) => ({
      ...docItem.data(),
      id: docItem.id,
    }));

    callback(news);
  });
}

export async function addNewsToFirestore(newsData) {
  const { id, ...cleanNewsData } = newsData;

  const docRef = await addDoc(newsCollection, {
    ...cleanNewsData,
    localId: id || Date.now(),
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

export async function updateNewsInFirestore(newsId, updates) {
  const { id, ...cleanUpdates } = updates || {};
  const newsRef = doc(db, "news", String(newsId));
  await updateDoc(newsRef, cleanUpdates);
}

export async function deleteNewsFromFirestore(newsId) {
  const newsRef = doc(db, "news", String(newsId));
  await deleteDoc(newsRef);
}