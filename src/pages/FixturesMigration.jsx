import { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAppData } from "../context/AppDataContext";

function FixturesMigration() {
  const { fixtures } = useAppData();
  const [message, setMessage] = useState("");

  const handleMigrateFixtures = async () => {
    try {
      const snapshot = await getDocs(collection(db, "fixtures"));

      if (!snapshot.empty) {
        setMessage("Fixtures collection already has data. Migration skipped.");
        return;
      }

      for (const fixture of fixtures) {
        const { id, homeTeam, awayTeam, gender, ...rest } = fixture;

        await addDoc(collection(db, "fixtures"), {
          ...rest,
          category: fixture.category || fixture.gender || "",
          gender: fixture.category || fixture.gender || "",
          homeTeamId: fixture.homeTeamId || null,
          awayTeamId: fixture.awayTeamId || null,
          legacyHomeTeamName: homeTeam || "",
          legacyAwayTeamName: awayTeam || "",
          localId: id,
          createdAt: new Date().toISOString(),
        });
      }

      setMessage("Fixtures migrated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Fixtures Migration</h1>
      <p>This will copy your current local fixtures into Firestore.</p>

      <button type="button" onClick={handleMigrateFixtures}>
        Migrate Fixtures to Firestore
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </main>
  );
}

export default FixturesMigration;