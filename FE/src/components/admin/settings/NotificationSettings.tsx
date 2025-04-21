import React from "react";

export default function NotificationSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
      <div>
        <label className="block text-sm font-medium">Enable Notifications For:</label>
        <div className="space-y-1 mt-1">
          <label><input type="checkbox" /> Admins</label>
          <label><input type="checkbox" /> Tenants</label>
          <label><input type="checkbox" /> Property Managers</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Daily Summary Emails</label>
        <select className="border px-3 py-2 rounded w-full">
          <option>Enabled</option>
          <option>Disabled</option>
        </select>
      </div>
      <button className="mt-4 bg-black text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}