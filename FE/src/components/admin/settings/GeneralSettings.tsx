import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GeneralSettings() {
  const [platformName, setPlatformName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/general`);
        if (res.data) {
          setPlatformName(res.data.platformName || "");
          setSupportEmail(res.data.supportEmail || "");
        }
      } catch (err) {
        console.error("Failed to fetch general settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const payload = { platformName, supportEmail };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/general`, payload);
      toast.success("Settings saved successfully.");
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="space-y-4">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">General Settings</h2>
      <div>
        <label className="block text-sm font-medium">Platform Name</label>
        {loading ? (
          <div className="animate-pulse bg-gray-100 h-10 w-full rounded"></div>
        ) : (
          <input
            type="text"
            className="border px-3 py-2 rounded w-full"
            placeholder="Enter platform name"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Support Email</label>
        {loading ? (
          <div className="animate-pulse bg-gray-100 h-10 w-full rounded"></div>
        ) : (
          <input
            type="email"
            className="border px-3 py-2 rounded w-full"
            placeholder="support@example.com"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />
        )}
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
        disabled={loading}
      >
        Save
      </button>
    </div>
  );
}
