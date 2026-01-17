import { createContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

// eslint-disable-next-line react-refresh/only-export-components
export const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/get.php`);
        const data = await res.json();
        setSite(data); // <-- IMPORTANT
      } catch (err) {
        console.error("Failed to load site settings", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  if (loading) return null; // or loader

  return (
    <SiteSettingsContext.Provider value={site}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
