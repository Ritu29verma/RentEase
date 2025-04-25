import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type MonthlyStats = {
  year: number;
  month: string; 
  collected: number;
  pending: number;
};

type Payment = {
  tenantName: string;
  amount: number;
  date: string;
};

export default function Dashboard() {
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [totalOverallCollected, setTotalOverallCollected] = useState<number>(0);
  const [totalTenants, setTotalTenants] = useState<number>(0);
  const [totalProperties, setTotalProperties] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/property/total`)
      .then(res => {
        setTotalProperties(res.data.totalProperties);
      })
      .catch(err => console.error("Failed to load total properties:", err));
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tenants/total`)
      .then(res => setTotalTenants(res.data.totalTenants))
      .catch(err => console.error("Failed to fetch total tenants:", err));
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/monthly-rent-stats`)
      .then(res => {
        const statsData: MonthlyStats[] = res.data; 
        const stats = statsData.map((stat: MonthlyStats) => ({
          year: stat.year, 
          month: `${stat.year}-${stat.month}`, 
          collected: stat.collected,
          pending: stat.pending,
        }));
  
        setMonthlyStats(stats); 
        const thisMonth = new Date().toLocaleString("default", { month: "long" });
        const currentMonthStats = stats.find((stat) => stat.month.includes(thisMonth));
        const totalOverallCollected = stats.reduce((sum, stat) => sum + stat.collected, 0);
        setTotalOverallCollected(totalOverallCollected);

        if (currentMonthStats) {
          setTotalCollected(currentMonthStats.collected);
        }
      })
      .catch(err => console.error("Failed to load monthly stats:", err));
  
    // Fetch recent payments
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/payment/recent-payments`)
      .then(res => {
        console.log("Recent Payments:", res.data);
        setRecentPayments(res.data);
      })
      .catch(err => console.error("Failed to load recent payments:", err));
  }, []);
  

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-500">Total Tenants</h3>
          <p className="text-xl font-bold">{totalTenants}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-500">Amount Collected (This Month)</h3>
          <p className="text-xl font-bold">₹{totalOverallCollected.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-500">Total Properties</h3>
          <p className="text-xl font-bold">{totalProperties}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Payment Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyStats}>
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
              {recentPayments.map((payment, index) => (
                <tr className="border-b" key={index}>
                  <td className="px-4 py-2">{payment.tenantName}</td>
                  <td className="px-4 py-2">₹{payment.amount}</td>
                  <td className="px-4 py-2">{payment.date}</td>
                </tr>
              ))}
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