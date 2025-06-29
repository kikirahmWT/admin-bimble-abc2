import { useState } from "react";
import { auth } from "../firebase";
import ContentEditor from "../components/ContentEditor";
import MultiDocEditor from "../components/MultiDocEditor";
import "../pages/Dashboard.css";

const collections = [
  "about",
  "contact",
  "gallery",
  "program belajar",
  "social_media",
  "pengajar",
  "welcome",
];

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("about");
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    setConfirmLogout(true);
  };

  const confirm = () => {
    auth.signOut().then(() => onLogout());
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        {collections.map((col) => (
          <button
            key={col}
            className={activeTab === col ? "active" : ""}
            onClick={() => setActiveTab(col)}
          >
            {col.replace("_", " ").toUpperCase()}
          </button>
        ))}
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="content">
        {["about", "welcome"].includes(activeTab) ? (
          <ContentEditor collectionName={activeTab} />
        ) : (
          <MultiDocEditor collectionName={activeTab} />
        )}
      </main>

      {confirmLogout && (
        <div className="modal">
          <div className="modal-box">
            <p>Yakin ingin logout?</p>
            <button onClick={confirm}>Ya</button>
            <button onClick={() => setConfirmLogout(false)}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}
