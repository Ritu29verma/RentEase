import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function ReminderSettings() {
  const [daysBeforeDue, setDaysBeforeDue] = useState("1");
  const [sendEmail, setSendEmail] = useState(false);
  const [sendSMS, setSendSMS] = useState(false);
  const [timeToSend, setTimeToSend] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/reminder`);
        if (res.data) {
          setDaysBeforeDue(String(res.data.daysBeforeDue || "1"));
          setSendEmail(res.data.sendViaEmail || false);
          setSendSMS(res.data.sendViaSMS || false);
          setTimeToSend(res.data.timeToSend || "");
        }
      } catch (err) {
        console.error("Error fetching reminder settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        daysBeforeDue: Number(daysBeforeDue),
        sendEmail,
        sendSMS,
        timeToSend,
      };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/reminder`, payload);
      toast.success("Reminder settings saved.");
    } catch (err) {
      console.error("Error saving reminder settings:", err);
      toast.error("Failed to save reminder settings.");
    }
  };

  return (
    <div className="space-y-4">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Reminder Settings</h2>
      
      <div>
        <label className="block text-sm font-medium">Days Before Due</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={daysBeforeDue}
          onChange={(e) => setDaysBeforeDue(e.target.value)}
          disabled={loading}
        >
          <option>1</option>
          <option>3</option>
          <option>5</option>
          <option>7</option>
        </select>
      </div>

      <div>
          <label className="block text-sm font-medium">Send Via</label>
          <div className="space-x-4 mt-1">
            <label>
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={() => setSendEmail(!sendEmail)}
              /> Email
            </label>
            <label>
              <input
                type="checkbox"
                checked={sendSMS}
                onChange={() => setSendSMS(!sendSMS)}
              /> SMS
            </label>
          </div>
        </div>


      <div>
        <label className="block text-sm font-medium">Time to Send</label>
        <input
          type="time"
          className="border px-3 py-2 rounded w-full"
          value={timeToSend}
          onChange={(e) => setTimeToSend(e.target.value)}
          disabled={loading}
        />
      </div>

      <button
        className="mt-4 bg-black text-white px-4 py-2 rounded"
        onClick={handleSave}
        disabled={loading}
      >
        Save
      </button>
    </div>
  );
}
