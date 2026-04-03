import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export async function createUserProfile(profileData) {
  const profileRef = doc(db, "profiles", profileData.email);

  await setDoc(profileRef, {
    fullName: profileData.fullName,
    email: profileData.email,
    department: profileData.department,
    level: profileData.level,
    role: profileData.role || "user",
    createdAt: new Date().toISOString(),
  });
}

export async function getUserProfileByEmail(email) {
  if (!email) return null;

  const profileRef = doc(db, "profiles", email);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function updateUserProfile(email, updates) {
  if (!email) return;

  const profileRef = doc(db, "profiles", email);
  await updateDoc(profileRef, updates);
}