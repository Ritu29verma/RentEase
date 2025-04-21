import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const chartData = [
  { month: "Jan", collected: 12000, pending: 2000 },
  { month: "Feb", collected: 15000, pending: 1000 },
  { month: "Mar", collected: 10000, pending: 4000 },
  { month: "Apr", collected: 18000, pending: 3000 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-500">Total Tenants</h3>
          <p className="text-xl font-bold">34</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-500">Amount Collected (This Month)</h3>
          <p className="text-xl font-bold">₹42,000</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-500">Total Properties</h3>
          <p className="text-xl font-bold">18</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Payment Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="collected" fill="#4ade80" name="Collected" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="#facc15" name="Pending" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dual Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Payments */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Tenant</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">John Doe</td>
                <td className="px-4 py-2">₹12,000</td>
                <td className="px-4 py-2">Apr 12, 2025</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Raj Patel</td>
                <td className="px-4 py-2">₹8,000</td>
                <td className="px-4 py-2">Apr 10, 2025</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-4">Upcoming Payments</h3>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Tenant</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">Jane Smith</td>
                <td className="px-4 py-2">₹10,000</td>
                <td className="px-4 py-2">Apr 15, 2025</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Amit Shah</td>
                <td className="px-4 py-2">₹9,500</td>
                <td className="px-4 py-2">Apr 18, 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
