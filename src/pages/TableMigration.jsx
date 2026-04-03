import { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAppData } from "../context/AppDataContext";

function TableMigration() {
  const { table } = useAppData();
  const [message, setMessage] = useState("");

  const handleMigrateTable = async () => {
    try {
      const snapshot = await getDocs(collection(db, "tables"));

      if (!snapshot.empty) {
        setMessage("Tables collection already has data. Migration skipped.");
        return;
      }

      for (const row of table) {
        const { id, ...rest } = row;

        await addDoc(collection(db, "tables"), {
          ...rest,
          localId: id || Date.now(),
          createdAt: new Date().toISOString(),
        });
      }

      setMessage("Table rows migrated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Table Migration</h1>
      <p>This will copy your current table rows into Firestore.</p>

      <button type="button" onClick={handleMigrateTable}>
        Migrate Tables to Firestore
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </main>
  );
}

export default TableMigration;