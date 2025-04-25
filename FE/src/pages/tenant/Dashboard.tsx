import React, { useEffect, useState } from "react";
import axios from "axios";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

export default function TenantDashboard() {
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState<{
    currentProperty: string;
    nextDueDate: string;
    totalPaid: number;
  } | null>(null);
  const [upcomingRent, setUpcomingRent] = useState<{ rentId: number; amount: number; dueDate: string } | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  
  const handlePayNow = async () => {
    try {
      console.log(`amount ${upcomingRent?.amount}, rentId ${ upcomingRent?.rentId}`)
      const token = localStorage.getItem("token");
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payment/init-stripe`, {
        rentScheduleId: upcomingRent?.rentId,
        amount: upcomingRent?.amount  
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Failed to initiate payment", err);
    }
  };
  
  useEffect(() => {
    
    const fetchData = async () => {
      try {

        const statsRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/tenants/my-stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(statsRes.data);

        // Fetch upcoming rent
        const rentRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/my-latest-rent-schedules`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (rentRes.data.data) {
          setUpcomingRent({
            rentId: rentRes.data.data.id,
            amount: rentRes.data.data.amount,
            dueDate: new Date(rentRes.data.data.dueDate).toDateString(),
          });
        }

        // Fetch recent invoices
        const invoiceRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/payment/my-invoices`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const topFiveInvoices = invoiceRes.data.data.slice(0, 5);
        setRecentInvoices(topFiveInvoices);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome back 👋</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded p-4 shadow">
          <p className="text-sm text-gray-500">Current Property</p>
          <p className="text-lg font-semibold">{stats?.currentProperty || "Loading..."}</p>
        </div>
        <div className="bg-white border rounded p-4 shadow">
          <p className="text-sm text-gray-500">Next Due Date</p>
          {stats?.nextDueDate ? new Date(stats.nextDueDate).toDateString() : "Loading..."}
        </div>
        <div className="bg-white border rounded p-4 shadow">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-lg font-semibold">₹{stats?.totalPaid?.toLocaleString() || "Loading..."}</p>
        </div>
      </div>

       {/* Upcoming Payment Reminder */}
       {upcomingRent && (
        <div className="bg-yellow-50 border border-yellow-300 rounded p-4 shadow space-y-2">
          <p className="text-sm text-yellow-800 font-medium">Upcoming Rent Due</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">₹{upcomingRent.amount}</p>
              <p className="text-sm text-gray-600">Due on {upcomingRent.dueDate}</p>
            </div>
            <button onClick={handlePayNow} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
              Pay Now
            </button>
          </div>
        </div>
      )}


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
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-b">
                  <td className="py-2">{inv.id}</td>
                  <td className="py-2">{inv.date}</td>
                  <td className="py-2">{inv.amount}</td>
                  <td className="py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        inv.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <button className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
