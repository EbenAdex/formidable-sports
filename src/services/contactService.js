import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const contactCollection = collection(db, "contactMessages");

export async function fetchContactMessagesOnce() {
  const snapshot = await getDocs(contactCollection);

  return snapshot.docs.map((docItem) => ({
    ...docItem.data(),
    id: docItem.id,
  }));
}

export function subscribeToContactMessages(callback) {
  return onSnapshot(contactCollection, (snapshot) => {
    const messages = snapshot.docs.map((docItem) => ({
      ...docItem.data(),
      id: docItem.id,
    }));

    callback(messages);
  });
}

export async function addContactMessageToFirestore(messageData) {
  const { id, ...cleanMessageData } = messageData;

  const docRef = await addDoc(contactCollection, {
    ...cleanMessageData,
    localId: id || Date.now(),
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

export async function deleteContactMessageFromFirestore(messageId) {
  const messageRef = doc(db, "contactMessages", String(messageId));
  await deleteDoc(messageRef);
}