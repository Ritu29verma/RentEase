import React from "react";

export default function BillingSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Billing Settings</h2>
      <div>
        <label className="block text-sm font-medium">Default Rent Frequency</label>
        <select className="border px-3 py-2 rounded w-full">
          <option>Monthly</option>
          <option>Quarterly</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Invoice Prefix</label>
        <input type="text" className="border px-3 py-2 rounded w-full" placeholder="INV-" />
      </div>
      <div>
        <label className="block text-sm font-medium">Grace Period (days)</label>
        <input type="number" className="border px-3 py-2 rounded w-full" placeholder="5" />
      </div>
      <button className="mt-4 bg-black text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}