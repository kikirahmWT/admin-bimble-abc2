import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function PengajarEditor() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  // Ambil data saat komponen dimuat
  useEffect(() => {
    db.collection("pengajar")
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeachers(data);
      })
      .catch((err) => {
        console.error("Gagal mengambil data pengajar:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fungsi untuk menyimpan semua data kembali ke koleksi
  const handleSave = async () => {
    try {
      // Hapus semua dokumen lama
      const snapshot = await db.collection("pengajar").get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      // Tambah ulang dengan data terkini
      const newBatch = db.batch();
      teachers.forEach((t) => {
        const ref = db.collection("pengajar").doc();
        newBatch.set(ref, {
          image: t.image,
          name: t.name,
          subject: t.subject,
        });
      });
      await newBatch.commit();

      setSuccess("Data pengajar berhasil disimpan!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    }
  };

  const handleAdd = () => {
    setTeachers([...teachers, { image: "", name: "", subject: "" }]);
  };

  const handleRemove = (index) => {
    setTeachers(teachers.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...teachers];
    updated[index][field] = value;
    setTeachers(updated);
  };

  if (loading) return <p>Memuat data pengajar...</p>;

  return (
    <div className="editor">
      <h2>Editor Pengajar</h2>

      {teachers.map((t, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
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
            title="Hapus pengajar"
          >
            ×
          </button>

          <label>Foto URL:</label>
          <input type="text" value={t.image} onChange={(e) => handleChange(i, "image", e.target.value)} placeholder="URL foto" style={{ width: "100%", marginBottom: "0.5rem" }} />

          {t.image && (
            <img
              src={t.image}
              alt={`Pengajar-${i}`}
              style={{
                width: "120px",
                borderRadius: "6px",
                marginBottom: "0.5rem",
              }}
            />
          )}

          <label>Nama:</label>
          <input type="text" value={t.name} onChange={(e) => handleChange(i, "name", e.target.value)} placeholder="Nama Pengajar" style={{ width: "100%", marginBottom: "0.5rem" }} />

          <label>Mata Pelajaran:</label>
          <input type="text" value={t.subject} onChange={(e) => handleChange(i, "subject", e.target.value)} placeholder="Mata pelajaran" style={{ width: "100%" }} />
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
        + Tambah Pengajar
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
