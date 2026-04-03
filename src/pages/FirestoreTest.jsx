import { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function FirestoreTest() {
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);

  const handleAddTestDoc = async () => {
    try {
      await addDoc(collection(db, "testMessages"), {
        text: "Hello from Formidable Sports",
        createdAt: new Date().toISOString(),
      });

      setMessage("Test document added successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLoadDocs = async () => {
    try {
      const snapshot = await getDocs(collection(db, "testMessages"));
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems(docs);
      setMessage("Documents loaded successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Firestore Test</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={handleAddTestDoc} type="button">
          Add Test Document
        </button>

        <button onClick={handleLoadDocs} type="button">
          Load Documents
        </button>
      </div>

      {message && <p>{message}</p>}

      <div>
        {items.map((item) => (
          <div key={item.id} style={{ marginBottom: "0.75rem" }}>
            <strong>{item.text}</strong>
            <p>{item.createdAt}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default FirestoreTest;