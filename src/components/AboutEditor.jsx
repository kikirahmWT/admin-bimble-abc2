import { useEffect, useState } from "react";
import { db } from "../firebase";
import "../styles/AboutEditor.css";

export default function AboutEditor() {
  const [about, setAbout] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState([]);
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  const fetchAboutData = () => {
    setLoading(true);
    db.collection("about")
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();
          setDocId(doc.id);
          setAbout(data.about || "");
          setVisi(data.visi || "");
          setMisi(data.misi || []);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleMisiChange = (index, value) => {
    const updated = [...misi];
    updated[index] = value;
    setMisi(updated);
  };

  const handleAddMisi = () => {
    setMisi([...misi, ""]);
  };

  const handleRemoveMisi = (index) => {
    const updated = misi.filter((_, i) => i !== index);
    setMisi(updated);
  };

  const handleSave = async () => {
    if (!docId) return;
    try {
      await db.collection("about").doc(docId).update({
        about,
        visi,
        misi,
      });
      setSuccess("Data berhasil disimpan!");

      // Ambil ulang data terbaru
      fetchAboutData();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    }
  };

  if (loading) return <p>Memuat data...</p>;

  return (
    <div className="editor">
      <h2>Halaman Tentang</h2>

      <div className="form-group">
        <label className="form-label">Tentang Kami:</label>
        <textarea className="form-textarea" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Tulis deskripsi singkat tentang lembaga Anda..." />
      </div>

      <div className="form-group">
        <label className="form-label">Visi:</label>
        <textarea className="form-textarea" value={visi} onChange={(e) => setVisi(e.target.value)} placeholder="Tulis visi lembaga Anda..." />
      </div>

      <div className="form-group">
        <label className="form-label">Misi:</label>
        {misi.map((item, idx) => (
          <div key={idx} className="misi-item">
            <input type="text" value={item} onChange={(e) => handleMisiChange(idx, e.target.value)} placeholder={`Misi ke-${idx + 1}`} className="form-input" />
            <button type="button" onClick={() => handleRemoveMisi(idx)} className="btn-remove">
              Hapus
            </button>
          </div>
        ))}

        <div className="add-button-wrapper">
          <button type="button" onClick={handleAddMisi} className="btn-add">
            + Tambah Misi
          </button>
        </div>
      </div>

      <br />
      <button onClick={handleSave}>Simpan Perubahan</button>
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
