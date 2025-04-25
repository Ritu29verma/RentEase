import { useState, useEffect } from "react";
import axios from "axios";

type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
};

export default function TenantInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/payment/my-invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvoices(res.data.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter === "all") return true;
    return inv.status === statusFilter;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">My Invoices</h1>

      <div className="flex items-center gap-2">
        <label className="text-sm">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-50 text-left border-b">
          <tr>
            <th className="py-2 px-3">Invoice No</th>
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((inv) => (
            <tr key={inv.id} className="border-b">
              <td className="py-2 px-3">{inv.id}</td>
              <td className="py-2 px-3">{inv.date}</td>
              <td className="py-2 px-3">{inv.amount}</td>
              <td className="py-2 px-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    inv.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {inv.status}
                </span>
              </td>
              <td className="py-2 px-3">
                <button className="text-blue-600 hover:underline">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
