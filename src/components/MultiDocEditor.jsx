import { useState, useEffect } from "react";
import { db } from "../firebase";

export default function MultiDocEditor({ collectionName }) {
  const [docs, setDocs] = useState([]);
  const [status, setStatus] = useState("");
  const [newDoc, setNewDoc] = useState({});

  // Ambil data
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const snapshot = await db.collection(collectionName).get();
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocs(items);
      } catch (err) {
        console.error(err);
        setStatus(" Gagal mengambil data.");
      }
    };

    fetchDocs();
  }, [collectionName]);

  const handleChange = (index, key, value) => {
    const updated = [...docs];
    updated[index][key] = value;
    setDocs(updated);
  };

  const handleSave = async (index) => {
    try {
      const { id, ...data } = docs[index];
      await db.collection(collectionName).doc(id).set(data);
      setStatus("Berhasil disimpan!");
    } catch (err) {
      console.error(err);
      setStatus(" Gagal menyimpan.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await db.collection(collectionName).doc(id).delete();
      setDocs((prev) => prev.filter((item) => item.id !== id));
      setStatus("Berhasil dihapus.");
    } catch (err) {
      console.error(err);
      setStatus(" Gagal menghapus.");
    }
  };

  const handleAdd = async () => {
    try {
      const newRef = await db.collection(collectionName).add(newDoc);
      setDocs((prev) => [...prev, { id: newRef.id, ...newDoc }]);
      setNewDoc({});
      setStatus(" Data baru berhasil ditambahkan!");
    } catch (error) {
      console.error(error);
      setStatus(" Gagal menambahkan data.");
    }
  };

  const allKeys = Array.from(
    new Set(docs.flatMap((d) => Object.keys(d).filter((k) => k !== "id")))
  );

  return (
    <div className="editor">
      <h3>Edit {collectionName}</h3>

      <h4>Tambah Data Baru</h4>
      {allKeys.map((field) => (
        <div key={field}>
          <label>{field}</label>
          <textarea
            value={newDoc[field] || ""}
            onChange={(e) =>
              setNewDoc((prev) => ({ ...prev, [field]: e.target.value }))
            }
            rows={2}
          />
        </div>
      ))}
      <button onClick={handleAdd}>+ Tambah</button>

      <hr style={{ margin: "1rem 0" }} />

      {docs.map((item, index) => (
        <div
          key={item.id}
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>ID:</strong> {item.id}
          </p>
          {Object.entries(item).map(([key, value]) =>
            key === "id" ? null : (
              <div key={key}>
                <label>{key}</label>
                <textarea
                  value={value}
                  onChange={(e) => handleChange(index, key, e.target.value)}
                  rows={2}
                />
              </div>
            )
          )}
          <div style={{ marginTop: "0.5rem" }}>
            <button onClick={() => handleSave(index)}>💾 Simpan</button>
            <button
              onClick={() => handleDelete(item.id)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#cc0000",
                color: "white",
              }}
            >
              🗑️ Hapus
            </button>
          </div>
        </div>
      ))}

      {status && (
        <p
          style={{
            marginTop: "1rem",
            fontWeight: "bold",
            color: status.includes("") ? "green" : "red",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}
