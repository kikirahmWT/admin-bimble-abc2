import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function ProgramBelajarEditor() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    db.collection("program belajar")
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrograms(data);
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    setPrograms([...programs, { title: "", subtitle: "" }]);
  };

  const handleRemove = (index) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...programs];
    updated[index][field] = value;
    setPrograms(updated);
  };

  const handleSave = async () => {
    try {
      // Hapus semua dokumen lama
      const snapshot = await db.collection("program belajar").get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      // Tambahkan data baru
      const newBatch = db.batch();
      programs.forEach((p) => {
        const ref = db.collection("program belajar").doc();
        newBatch.set(ref, {
          title: p.title,
          subtitle: p.subtitle,
        });
      });
      await newBatch.commit();

      setSuccess("Program berhasil disimpan!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    }
  };

  if (loading) return <p>Memuat data program...</p>;

  return (
    <div className="editor">
      <h2>Program Belajar</h2>

      {programs.map((p, i) => (
        <div
          key={i}
          style={{
            marginBottom: "1rem",
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "6px",
            position: "relative",
          }}
        >
          <button
            onClick={() => handleRemove(i)}
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
            title="Hapus program"
          >
            ×
          </button>

          <label>Judul:</label>
          <input type="text" value={p.title} onChange={(e) => handleChange(i, "title", e.target.value)} placeholder="Judul program" style={{ width: "100%", marginBottom: "0.5rem" }} />

          <label>Subjudul:</label>
          <input type="text" value={p.subtitle} onChange={(e) => handleChange(i, "subtitle", e.target.value)} placeholder="Subjudul program" style={{ width: "100%" }} />
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
        + Tambah Program
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
