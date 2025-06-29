import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function WelcomeEditor() {
  const [welcomes, setWelcomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    db.collection("welcome")
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWelcomes(data);
      })
      .catch((err) => console.error("Gagal mengambil data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...welcomes];
    updated[index][field] = value;
    setWelcomes(updated);
  };

  const handleAdd = () => {
    setWelcomes([...welcomes, { titel: "", subtitel: "" }]);
  };

  const handleRemove = (index) => {
    setWelcomes(welcomes.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      // Hapus semua dokumen lama
      const snapshot = await db.collection("welcome").get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      // Tambahkan ulang
      const newBatch = db.batch();
      welcomes.forEach((item) => {
        const ref = db.collection("welcome").doc();
        newBatch.set(ref, {
          titel: item.titel,
          subtitel: item.subtitel,
        });
      });
      await newBatch.commit();

      setSuccess("Data berhasil disimpan!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    }
  };

  if (loading) return <p>Memuat data...</p>;

  return (
    <div className="editor">
      <h2>Editor Halaman Welcome</h2>

      {welcomes.map((item, index) => (
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
          <label>Judul:</label>
          <input type="text" value={item.titel} onChange={(e) => handleChange(index, "titel", e.target.value)} placeholder="Masukkan judul" style={{ width: "100%", marginBottom: "0.5rem" }} />

          <label>Subjudul:</label>
          <input type="text" value={item.subtitel} onChange={(e) => handleChange(index, "subtitel", e.target.value)} placeholder="Masukkan subjudul" style={{ width: "100%" }} />
        </div>
      ))}

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
