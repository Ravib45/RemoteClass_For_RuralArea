// src/components/CookieBanner.jsx
import { useEffect, useState } from "react";
import { FaCookieBite, FaSlidersH } from "react-icons/fa";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedPrefs = localStorage.getItem("cookiePreferences");
    if (!savedPrefs) {
      setTimeout(() => setVisible(true), 500); // Delay for fade-in effect
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({ necessary: true, analytics: true, marketing: true })
    );
    setVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({ necessary: true, analytics: false, marketing: false })
    );
    setVisible(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-[#1f1f3b] text-white p-6 md:p-4 rounded-xl shadow-2xl z-50 animate-fadeIn transition-all duration-500">
      {!showSettings ? (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <FaCookieBite className="text-yellow-400 text-xl" />
            <span>
              We use cookies to personalize content and improve your experience.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAcceptAll}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm"
            >
              Accept All
            </button>
            <button
              onClick={handleRejectAll}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm"
            >
              Reject
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full text-sm flex items-center gap-2"
            >
              <FaSlidersH /> Manage
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-yellow-300">Manage Cookie Preferences</h3>
          {["necessary", "analytics", "marketing"].map((type) => (
            <label key={type} className="block text-sm capitalize text-white">
              <input
                type="checkbox"
                disabled={type === "necessary"}
                checked={preferences[type]}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    [type]: e.target.checked,
                  }))
                }
                className="mr-2 accent-yellow-400"
              />
              {type === "necessary"
                ? `${type} (Always Required)`
                : type}
            </label>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleSaveSettings}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Save Preferences
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 text-sm hover:text-white underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
