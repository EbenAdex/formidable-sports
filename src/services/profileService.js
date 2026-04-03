import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export async function createUserProfile(profileData) {
  if (!profileData?.email) {
    throw new Error("Email is required to create a profile.");
  }

  const profileRef = doc(db, "profiles", profileData.email);

  await setDoc(profileRef, {
    fullName: profileData.fullName || "N/A",
    email: profileData.email,
    department: profileData.department || "N/A",
    level: profileData.level || "N/A",
    role: profileData.role || "user",
    createdAt: profileData.createdAt || new Date().toISOString(),
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

export async function ensureUserProfile(profileData) {
  if (!profileData?.email) {
    throw new Error("Email is required to ensure a profile.");
  }

  const existingProfile = await getUserProfileByEmail(profileData.email);

  if (existingProfile) {
    return existingProfile;
  }

  await createUserProfile({
    fullName: profileData.fullName || "N/A",
    email: profileData.email,
    department: profileData.department || "N/A",
    level: profileData.level || "N/A",
    role: profileData.role || "user",
  });

  return await getUserProfileByEmail(profileData.email);
}

export async function updateUserProfile(email, updates) {
  if (!email) return;

  const profileRef = doc(db, "profiles", email);
  await updateDoc(profileRef, updates);
}