import React from "react";

export default function ReminderSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Reminder Settings</h2>
      <div>
        <label className="block text-sm font-medium">Days Before Due</label>
        <select className="border px-3 py-2 rounded w-full">
          <option>1</option>
          <option>3</option>
          <option>5</option>
          <option>7</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Send Via</label>
        <div className="space-x-4 mt-1">
          <label><input type="checkbox" /> Email</label>
          <label><input type="checkbox" /> SMS</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Time to Send</label>
        <input type="time" className="border px-3 py-2 rounded w-full" />
      </div>
      <button className="mt-4 bg-black text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}