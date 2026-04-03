import { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAppData } from "../context/AppDataContext";

function TeamsMigration() {
  const { teams } = useAppData();
  const [message, setMessage] = useState("");

  const handleMigrateTeams = async () => {
    try {
      const snapshot = await getDocs(collection(db, "teams"));

      if (!snapshot.empty) {
        setMessage("Teams collection already has data. Migration skipped.");
        return;
      }

      for (const team of teams) {
        const { id, ...teamWithoutLocalId } = team;

        await addDoc(collection(db, "teams"), {
          ...teamWithoutLocalId,
          localId: id,
          createdAt: new Date().toISOString(),
        });
      }

      setMessage("Teams migrated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Teams Migration</h1>
      <p>This will copy your current local teams into Firestore.</p>

      <button type="button" onClick={handleMigrateTeams}>
        Migrate Teams to Firestore
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </main>
  );
}

export default TeamsMigration;