import React from "react";

export default function TenantDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome back 👋</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded p-4 shadow">
          <p className="text-sm text-gray-500">Current Property</p>
          <p className="text-lg font-semibold">Flat 101 - Green Residency</p>
        </div>
        <div className="bg-white border rounded p-4 shadow">
          <p className="text-sm text-gray-500">Next Due Date</p>
          <p className="text-lg font-semibold">May 01, 2025</p>
        </div>
        <div className="bg-white border rounded p-4 shadow">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-lg font-semibold">₹1,20,000</p>
        </div>
      </div>

      {/* Upcoming Payment Reminder */}
      <div className="bg-yellow-50 border border-yellow-300 rounded p-4 shadow space-y-2">
        <p className="text-sm text-yellow-800 font-medium">Upcoming Rent Due</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">₹12,000</p>
            <p className="text-sm text-gray-600">Due on May 01, 2025</p>
          </div>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            Pay Now
          </button>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white border rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-3">Recent Invoices</h2>
        <table className="w-full text-sm">
          <thead className="border-b text-left">
            <tr>
              <th className="py-2">Invoice</th>
              <th className="py-2">Date</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">INV-001</td>
              <td className="py-2">Apr 01, 2025</td>
              <td className="py-2">₹12,000</td>
              <td className="py-2 text-green-600">Paid</td>
              <td className="py-2">
                <button className="text-blue-600 hover:underline">View</button>
              </td>
            </tr>
            <tr>
              <td className="py-2">INV-002</td>
              <td className="py-2">May 01, 2025</td>
              <td className="py-2">₹12,000</td>
              <td className="py-2 text-yellow-600">Pending</td>
              <td className="py-2">
                <button className="text-blue-600 hover:underline">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
