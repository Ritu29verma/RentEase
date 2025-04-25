import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import axios from "axios";

interface Payment {
  invoice: string;
  transactionId: string;
  tenant: string;
  property: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPayments = async () => {
      console.log("📡 Fetching invoices...");
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/payment/admin/invoices`);
        console.log("✅ Response received:", res.data);

        const formatted = res.data.data.map((item: any) => ({
          invoice: item.invoiceNo,
          transactionId: item.transactionId,
          tenant: item.tenantName,
          property: item.propertyName,
          date: item.paymentDate,
          amount: parseInt(item.amount.replace(/[^0-9]/g, "")), // removes ₹ and comma
          status: item.status.toLowerCase(), // converts to 'pending', 'paid', etc.
        }));

        setPayments(formatted);
      } catch (err) {
        console.error("❌ Error fetching payments:", err);
      }
    };

    fetchPayments();
  }, []);


  const filtered = payments.filter((p) => {
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    const matchesSearch =
      p.tenant.toLowerCase().includes(search.toLowerCase()) ||
      p.property.toLowerCase().includes(search.toLowerCase());

    const date = new Date(p.date);
    const matchesMonth = monthFilter === "All" || date.getMonth() + 1 === parseInt(monthFilter);
    const matchesYear = yearFilter === "All" || date.getFullYear().toString() === yearFilter;
    const matchesFrom = !fromDate || date >= new Date(fromDate);
    const matchesTo = !toDate || date <= new Date(toDate);

    return matchesStatus && matchesSearch && matchesMonth && matchesYear && matchesFrom && matchesTo;
  });

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const exportCSV = () => {
    const csv = Papa.unparse(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "payments.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Payment Records", 14, 14);
    autoTable(doc, {
      startY: 20,
      head: [["Invoice", "Transaction ID", "Tenant", "Property", "Date", "Amount", "Status"]],
      body: filtered.map((p) => [
        p.invoice,
        p.transactionId,
        p.tenant,
        p.property,
        p.date,
        p.amount,
        p.status,
      ]),
    });
    doc.save("payments.pdf");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-3 items-end justify-between">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex flex-wrap gap-2 items-end">
          <input
            type="text"
            placeholder="Search tenant/property"
            className="border px-3 py-1 text-sm rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border px-3 py-1 text-sm rounded"
          >
            <option value="All">All Years</option>
            <option value="2024">2024</option>
          </select>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="border px-3 py-1 text-sm rounded"
          >
            <option value="All">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "short" })}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-1 text-sm rounded"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-1 text-sm rounded"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-1 text-sm rounded"
          />
          <button onClick={exportCSV} className="border px-3 py-1 rounded text-sm">
            Export CSV
          </button>
          <button onClick={exportPDF} className="border px-3 py-1 rounded text-sm">
            Export PDF
          </button>
        </div>
      </div>

      <table className="w-full text-sm border">
        <thead className="text-left bg-gray-50 border-b">
          <tr>
            <th className="py-2 px-3">Invoice No.</th>
            <th className="py-2 px-3">Transaction ID</th>
            <th className="py-2 px-3">Tenant</th>
            <th className="py-2 px-3">Property</th>
            <th className="py-2 px-3">Payment Date</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((p, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2 flex flex-col gap-1">
                <Link to={`/admin/invoice/${p.invoice}`} className="text-blue-600 hover:underline">
                  {p.invoice}
                </Link>
                
              </td>

              <td className="px-3 py-2">
                {p.transactionId.length >= 10
                  ? `XXX${p.transactionId.slice(-7)}`
                  : `XXX${p.transactionId.slice(-7).padStart(7, '*')}`}
              </td>

              <td className="px-3 py-2">{p.tenant}</td>
              <td className="px-3 py-2">{p.property}</td>
              <td className="px-3 py-2">
                {new Date(p.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              <td className="px-3 py-2">{p.amount}</td>
              <td className="px-3 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between text-sm font-semibold">
        <div>
          Total (this page): ₹
          {paginated.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
        </div>
        <div>
          Total (this month): ₹
          {filtered.reduce((sum, p) => {
            const date = new Date(p.date);
            const now = new Date();
            const sameMonth = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            return sameMonth ? sum + p.amount : sum;
          }, 0).toLocaleString()}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end gap-2 text-sm mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="self-center">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}