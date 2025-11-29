import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Properties from "./pages/Properties.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";
import { SiteSettingsContext } from "./context/SiteSettingsContext";
import { API_BASE_URL } from "./config";

export default function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/get.php`);
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load site settings", err);
      }
    }
    loadSettings();
  }, []);

  // Before settings load → prevent empty UI flash
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading site…
      </div>
    );
  }

  return (
    <SiteSettingsContext.Provider value={settings}>
      <div className="min-h-screen flex flex-col bg-[#0A0E27]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SiteSettingsContext.Provider>
  );
}
