export default function Sidebar({ collections, activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="sidebar">
      <h2>Admin Panel</h2>
      {collections.map((col) => (
        <button key={col} className={activeTab === col ? "active" : ""} onClick={() => setActiveTab(col)}>
          {col.replace("_", " ").toUpperCase()}
        </button>
      ))}
      <button className="logout" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}
