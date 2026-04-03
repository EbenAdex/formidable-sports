import { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAppData } from "../context/AppDataContext";

function ResultsMigration() {
  const { results } = useAppData();
  const [message, setMessage] = useState("");

  const handleMigrateResults = async () => {
    try {
      const snapshot = await getDocs(collection(db, "results"));

      if (!snapshot.empty) {
        setMessage("Results collection already has data. Migration skipped.");
        return;
      }

      for (const result of results) {
        const { id, ...rest } = result;

        await addDoc(collection(db, "results"), {
          ...rest,
          localId: id || Date.now(),
          createdAt: new Date().toISOString(),
        });
      }

      setMessage("Results migrated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Results Migration</h1>
      <p>This will copy your current results into Firestore.</p>

      <button type="button" onClick={handleMigrateResults}>
        Migrate Results to Firestore
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </main>
  );
}

export default ResultsMigration;