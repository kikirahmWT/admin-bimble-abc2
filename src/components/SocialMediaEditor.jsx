import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function SocialMediaEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    db.collection("social_media")
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
      })
      .catch((err) => console.error("Gagal mengambil data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleAdd = () => {
    setItems([...items, { icon: "", titel: "", url: "" }]);
  };

  const handleRemove = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const snapshot = await db.collection("social_media").get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      const newBatch = db.batch();
      items.forEach((item) => {
        const ref = db.collection("social_media").doc();
        newBatch.set(ref, {
          icon: item.icon,
          titel: item.titel,
          url: item.url,
        });
      });
      await newBatch.commit();

      setSuccess("Data berhasil disimpan!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    }
  };

  if (loading) return <p>Memuat data media sosial...</p>;

  return (
    <div className="editor">
      <h2>Media Sosial</h2>

      {items.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            position: "relative",
          }}
        >
          <button
            onClick={() => handleRemove(index)}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              fontSize: "14px",
              cursor: "pointer",
            }}
            title="Hapus"
          >
            ×
          </button>

          <label>Icon:</label>
          <input type="text" value={item.icon} onChange={(e) => handleChange(index, "icon", e.target.value)} placeholder="Contoh: fa-facebook" style={{ width: "100%", marginBottom: "0.5rem" }} />

          <label>Judul:</label>
          <input type="text" value={item.titel} onChange={(e) => handleChange(index, "titel", e.target.value)} placeholder="Contoh: Facebook" style={{ width: "100%", marginBottom: "0.5rem" }} />

          <label>URL:</label>
          <input type="text" value={item.url} onChange={(e) => handleChange(index, "url", e.target.value)} placeholder="https://facebook.com/nama" style={{ width: "100%" }} />
        </div>
      ))}

      <button
        onClick={handleAdd}
        style={{
          background: "#3498db",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          fontSize: "0.95rem",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        + Tambah Media Sosial
      </button>

      <br />

      <button
        onClick={handleSave}
        style={{
          padding: "0.6rem 1.2rem",
          background: "#2ecc71",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Simpan Perubahan
      </button>

      {success && <p style={{ color: "green", marginTop: "1rem", fontWeight: "bold" }}>{success}</p>}
    </div>
  );
}
