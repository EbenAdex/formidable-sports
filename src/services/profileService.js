import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const profilesCollection = collection(db, "profiles");

export async function getUserProfileByEmail(email) {
  const q = query(profilesCollection, where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docItem = snapshot.docs[0];
  return {
    id: docItem.id,
    ...docItem.data(),
  };
}

export async function createUserProfile(profile) {
  await addDoc(profilesCollection, profile);
}

export async function ensureUserProfile(profile) {
  const existing = await getUserProfileByEmail(profile.email);

  if (existing) return existing;

  await createUserProfile(profile);
  return await getUserProfileByEmail(profile.email);
}

export async function updateUserProfileByEmail(email, updates) {
  const q = query(profilesCollection, where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Profile not found.");
  }

  const docRef = snapshot.docs[0].ref;
  await updateDoc(docRef, updates);
}