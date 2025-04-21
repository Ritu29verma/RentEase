import React from "react";

export default function GeneralSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">General Settings</h2>
      <div>
        <label className="block text-sm font-medium">Platform Name</label>
        <input type="text" className="border px-3 py-2 rounded w-full" placeholder="Enter platform name" />
      </div>
      <div>
        <label className="block text-sm font-medium">Support Email</label>
        <input type="email" className="border px-3 py-2 rounded w-full" placeholder="support@example.com" />
      </div>
      <button className="mt-4 bg-black text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}