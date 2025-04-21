import React from "react";

export default function ApprovalSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Approval Settings</h2>
      <div className="space-y-2">
        <label><input type="checkbox" /> Require approval for tenant onboarding</label>
        <label><input type="checkbox" /> Require approval before invoice is finalized</label>
        <label><input type="checkbox" /> Only admin can edit properties</label>
      </div>
      <button className="mt-4 bg-black text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}