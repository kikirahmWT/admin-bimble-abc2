import { useState, useEffect } from "react";
import { db } from "../firebase";
import { FaPlus, FaSave, FaTrashAlt } from "react-icons/fa";

export default function ContentEditor({ collectionName }) {
  const [data, setData] = useState({});
  const [status, setStatus] = useState("");

  // Ambil data awal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = db.collection(collectionName).doc("content");
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          setData(docSnap.data());
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setStatus(" Gagal memuat data.");
      }
    };
    fetchData();
  }, [collectionName]);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleMisiChange = (index, value) => {
    const newMisi = [...(data.misi || [])];
    newMisi[index] = value;
    setData((prev) => ({ ...prev, misi: newMisi }));
  };

  const addMisi = () => {
    const newMisi = [...(data.misi || []), ""];
    setData((prev) => ({ ...prev, misi: newMisi }));
  };

  const removeMisi = (index) => {
    const newMisi = data.misi.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, misi: newMisi }));
  };

  const handleSave = async () => {
    try {
      await db.collection(collectionName).doc("content").set(data);
      setStatus(" Berhasil disimpan!");
    } catch (error) {
      console.error("Error saat menyimpan:", error);
      setStatus(" Gagal menyimpan.");
    } finally {
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="editor">
      <h3>Edit {collectionName.replace("_", " ").toUpperCase()}</h3>

      {collectionName === "about" ? (
        <>
          <label>Tentang Kami</label>
          <textarea
            value={data.about || ""}
            onChange={(e) => handleChange("about", e.target.value)}
            rows={6}
            style={textareaStyle}
          />

          <label>Visi</label>
          <textarea
            value={data.visi || ""}
            onChange={(e) => handleChange("visi", e.target.value)}
            rows={4}
            style={textareaStyle}
          />

          <label>Misi</label>
          {(data.misi || []).map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div style={{ flex: 1 }}>
                <strong style={{ display: "block", marginBottom: "4px" }}>
                  Misi ke-{index + 1}
                </strong>
                <textarea
                  value={data.item || ""}
                  onChange={(e) => handleChange("misi", e.target.value, index)}
                  rows={4}
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>
              <button
                onClick={() => removeMisi(index)}
                title="Hapus"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "red",
                  fontSize: "15px",
                  cursor: "pointer",
                  marginTop: "15px",
                }}
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
          <button
            onClick={addMisi}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 14px",
              marginTop: "0.5rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            <FaPlus /> Tambah Misi
          </button>
        </>
      ) : (
        Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <label>{key}</label>
            <textarea
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              rows={4}
              style={textareaStyle}
            />
          </div>
        ))
      )}

      <button
        onClick={handleSave}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: "green",
          color: "white",
          padding: "10px 18px",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        <FaSave /> Simpan
      </button>

      {status && (
        <p
          style={{
            marginTop: "10px",
            color: status.includes("Gagal") ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

// Style global untuk semua textarea
const textareaStyle = {
  width: "100%",
  minHeight: "80px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontFamily: "inherit",
  resize: "vertical",
  boxSizing: "border-box",
};
