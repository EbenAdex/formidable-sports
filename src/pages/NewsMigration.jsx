import { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import initialNews from "../data/newsData.js";

function NewsMigration() {
  const [message, setMessage] = useState("");

  const handleMigrateNews = async () => {
    try {
      const snapshot = await getDocs(collection(db, "news"));

      if (!snapshot.empty) {
        setMessage("News collection already has data. Migration skipped.");
        return;
      }

      if (!initialNews.length) {
        setMessage("No news items found to migrate.");
        return;
      }

      for (const item of initialNews) {
        const { id, ...rest } = item;

        await addDoc(collection(db, "news"), {
          ...rest,
          localId: id || Date.now(),
          createdAt: new Date().toISOString(),
        });
      }

      setMessage("News migrated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>News Migration</h1>
      <p>This will copy your original news items into Firestore.</p>

      <button type="button" onClick={handleMigrateNews}>
        Migrate News to Firestore
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </main>
  );
}

export default NewsMigration;