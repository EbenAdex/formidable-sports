import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const sportRulesCollection = collection(db, "sportRules");

export async function seedDefaultSportRules(defaultRules) {
  const snapshot = await getDocs(sportRulesCollection);

  if (!snapshot.empty) return;

  for (const rule of defaultRules) {
    await addDoc(sportRulesCollection, {
      ...rule,
      createdAt: new Date().toISOString(),
    });
  }
}

export function subscribeToSportRules(callback) {
  return onSnapshot(sportRulesCollection, (snapshot) => {
    const rules = snapshot.docs.map((docItem) => ({
      ...docItem.data(),
      id: docItem.id,
    }));

    callback(rules);
  });
}

export async function updateSportRuleInFirestore(ruleId, updates) {
  const { id, ...cleanUpdates } = updates || {};
  const ruleRef = doc(db, "sportRules", String(ruleId));
  await updateDoc(ruleRef, cleanUpdates);
}