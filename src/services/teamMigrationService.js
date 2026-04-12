import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import facultyDepartments from "../data/facultyDepartments";

const teamsCollection = collection(db, "teams");

const DEFAULT_SPORTS = ["Football", "Basketball", "Volleyball", "Tennis"];
const DEFAULT_CATEGORIES = ["Male", "Female"];

function normalizeText(value = "") {
  return String(value).trim().toLowerCase();
}

export async function migrateFacultyDepartmentsToTeams() {
  const snapshot = await getDocs(teamsCollection);

  const existingTeams = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));

  const existingKeys = new Set(
    existingTeams.map(
      (team) =>
        `${normalizeText(team.name)}__${normalizeText(team.category)}`
    )
  );

  let createdCount = 0;

  for (const department of facultyDepartments) {
    for (const category of DEFAULT_CATEGORIES) {
      const key = `${normalizeText(department)}__${normalizeText(category)}`;

      if (existingKeys.has(key)) {
        continue;
      }

      await addDoc(teamsCollection, {
        name: department,
        category,
        qualified: true,
        sports: DEFAULT_SPORTS,
        players: [],
        coachName: "",
        logo: "",
        createdAt: new Date().toISOString(),
      });

      existingKeys.add(key);
      createdCount += 1;
    }
  }

  return {
    success: true,
    createdCount,
    totalExpected: facultyDepartments.length * DEFAULT_CATEGORIES.length,
  };
}