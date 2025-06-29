import { useEffect, useState } from "react";
import { db } from "../firebase"; // sesuaikan path

export default function GalleryEditor() {
  const [images, setImages] = useState([]);
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    db.collection("gallery")
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setDocId(doc.id);
          setImages(doc.data().activity || []);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil galeri:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleAddImage = () => {
    setImages([...images, ""]);
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const handleSave = async () => {
    if (!docId) return;
    try {
      await db.collection("gallery").doc(docId).update({
        activity: images,
      });
      setSuccess("Galeri berhasil diperbarui.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Gagal menyimpan galeri:", err);
    }
  };

  if (loading) return <p>Memuat galeri...</p>;

  return (
    <div className="editor">
      <h2>Editor Galeri</h2>

      {images.map((url, index) => (
        <div
          key={index}
          style={{
            marginBottom: "1.5rem",
            position: "relative",
            width: "max-content",
          }}
        >
          {url && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={url}
                alt={`image-${index}`}
                style={{
                  width: "200px",
                  borderRadius: "6px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                title="Hapus gambar"
              >
                ×
              </button>
            </div>
          )}

          <input
            type="text"
            value={url}
            onChange={(e) => handleImageChange(index, e.target.value)}
            placeholder="URL gambar"
            style={{
              display: "block",
              marginTop: "0.5rem",
              width: "100%",
              padding: "0.5rem",
              fontSize: "0.95rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      ))}

      <button
        onClick={handleAddImage}
        style={{
          background: "#3498db",
          color: "#fff",
          border: "none",
          padding: "0.4rem 0.8rem",
          borderRadius: "4px",
          fontSize: "0.9rem",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        + Tambah Gambar
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
