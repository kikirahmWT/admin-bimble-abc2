import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function ContactEditor() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const snapshot = await db.collection("contact").get();
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          icon: doc.data().icon || "",
          title: doc.data().title || "",
          type: doc.data().type || "",
        }));
        setContacts(data);
      } catch (error) {
        console.error("Gagal mengambil data kontak:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleChange = (id, field, value) => {
    setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, [field]: value } : contact)));
  };

  const handleSave = async (contact) => {
    try {
      await db.collection("contact").doc(contact.id).update({
        icon: contact.icon,
        title: contact.title,
        type: contact.type,
      });
      setSuccessId(contact.id);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (err) {
      console.error("Gagal menyimpan kontak:", err);
    }
  };

  if (loading) return <p>Memuat data kontak...</p>;

  return (
    <div className="editor">
      <h2>Kontak</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {contacts.map((c) => (
          <li
            key={c.id}
            style={{
              background: "#f9f9f9",
              padding: "1.2rem",
              marginBottom: "1.5rem",
              borderRadius: "10px",
              boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontWeight: "bold" }}>Icon (URL Gambar):</label>
              <input
                type="text"
                value={c.icon}
                onChange={(e) => handleChange(c.id, "icon", e.target.value)}
                placeholder="Masukkan URL gambar"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "6px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              {c.icon && (
                <img
                  src={c.icon}
                  alt="icon"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "contain",
                    marginTop: "5px",
                  }}
                />
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontWeight: "bold" }}>Type:</label>
              <input
                type="text"
                value={c.type}
                onChange={(e) => handleChange(c.id, "type", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "6px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontWeight: "bold" }}>Title:</label>
              <input
                type="text"
                value={c.title}
                onChange={(e) => handleChange(c.id, "title", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "6px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <button
              onClick={() => handleSave(c)}
              style={{
                background: "#003366",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Simpan Perubahan
            </button>

            {successId === c.id && <p style={{ color: "green", marginTop: "10px" }}>Data berhasil diperbarui!</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
