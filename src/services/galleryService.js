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

const galleryCollection = collection(db, "gallery");

export function subscribeToGallery(callback) {
  const q = query(galleryCollection, orderBy("title", "asc"));

  return onSnapshot(q, (snapshot) => {
    const galleryItems = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));

    callback(galleryItems);
  });
}

export async function addGalleryItemToFirestore(item) {
  await addDoc(galleryCollection, {
    title: item.title || "",
    image: item.image || "",
    description: item.description || "",
    category: item.category || "General",
    createdAt: Date.now(),
  });
}

export async function updateGalleryItemInFirestore(id, updates) {
  const galleryRef = doc(db, "gallery", id);

  await updateDoc(galleryRef, {
    ...updates,
  });
}

export async function deleteGalleryItemFromFirestore(id) {
  const galleryRef = doc(db, "gallery", id);
  await deleteDoc(galleryRef);
}