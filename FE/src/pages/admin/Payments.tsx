import { Link } from "react-router-dom";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

export default function Payments() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const payments = [
    {
      invoice: "INV-001",
      transactionId: "TXN123456",
      tenant: "John Doe",
      property: "Flat 101 - Green Residency",
      date: "2024-04-05",
      amount: "₹12000",
      status: "Paid",
    },
    {
      invoice: "INV-002",
      transactionId: "TXN654321",
      tenant: "Jane Smith",
      property: "Sunrise Apartments - 3B",
      date: "2024-05-01",
      amount: "₹12000",
      status: "Pending",
    },
  ];

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
              <td className="px-3 py-2 text-blue-600 hover:underline">
                <Link to={`/admin/invoice/${p.invoice}`}>{p.invoice}</Link>
              </td>
              <td className="px-3 py-2">{p.transactionId}</td>
              <td className="px-3 py-2">{p.tenant}</td>
              <td className="px-3 py-2">{p.property}</td>
              <td className="px-3 py-2">{p.date}</td>
              <td className="px-3 py-2">{p.amount}</td>
              <td
                className={`px-3 py-2 ${
                  p.status === "Paid" ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {p.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between text-sm font-semibold">
        <div>
          Total (this page): ₹
          {paginated.reduce((sum, p) => sum + parseInt(p.amount.replace(/[^0-9]/g, "")), 0).toLocaleString()}
        </div>
        <div>
          Total (this month): ₹
          {filtered.reduce((sum, p) => {
            const date = new Date(p.date);
            const now = new Date();
            const sameMonth = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            return sameMonth ? sum + parseInt(p.amount.replace(/[^0-9]/g, "")) : sum;
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
