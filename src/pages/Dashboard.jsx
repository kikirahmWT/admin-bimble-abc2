import { useState } from "react";
import { auth } from "../firebase";
import Sidebar from "../components/Sidebar";
import LogoutModal from "../components/LogoutModal";
import AboutEditor from "../components/AboutEditor";
import ContactEditor from "../components/ContactEditor";
import GalleryEditor from "../components/GalleryEditor";
import ProgramBelajarEditor from "../components/ProgramBelajarEditor";
import SocialMediaEditor from "../components/SocialMediaEditor";
import PengajarEditor from "../components/PengajarEditor";
import WelcomeEditor from "../components/WelcomeEditor";
import "../styles/Dashboard.css";

const collections = ["about", "contact", "gallery", "program belajar", "social_media", "pengajar", "welcome"];

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("about");
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => setConfirmLogout(true);
  const confirm = () => auth.signOut().then(() => onLogout());

  const renderEditor = () => {
    switch (activeTab) {
      case "about":
        return <AboutEditor />;
      case "contact":
        return <ContactEditor />;
      case "gallery":
        return <GalleryEditor />;
      case "program belajar":
        return <ProgramBelajarEditor />;
      case "social_media":
        return <SocialMediaEditor />;
      case "pengajar":
        return <PengajarEditor />;
      case "welcome":
        return <WelcomeEditor />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar collections={collections} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="content">{renderEditor()}</main>

      {confirmLogout && <LogoutModal onConfirm={confirm} onCancel={() => setConfirmLogout(false)} />}
    </div>
  );
}
