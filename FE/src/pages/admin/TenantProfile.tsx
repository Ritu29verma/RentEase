// File: src/pages/admin/TenantProfile.tsx
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TenantProfile() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("All");

  const payments = [
    {
      invoice: "INV-001",
      invoiceDate: "Mar 01, 2024",
      paymentDate: "Mar 03, 2024",
      amount: "₹12,000",
      status: "Paid",
    },
    {
      invoice: "INV-002",
      invoiceDate: "Apr 01, 2024",
      paymentDate: "Apr 05, 2024",
      amount: "₹12,000",
      status: "Paid",
    },
    {
      invoice: "INV-003",
      invoiceDate: "May 01, 2024",
      paymentDate: "—",
      amount: "₹12,000",
      status: "Pending",
    },
  ];

  const stayHistory = [
    { property: "Flat 101 - Green Residency", from: "Jan 01, 2023", to: "Dec 31, 2023" },
    { property: "Room 3B - Sunrise Apartments", from: "Jan 01, 2024", to: "Present" },
  ];

  const filteredPayments =
    filterStatus === "All"
      ? payments
      : payments.filter((p) => p.status === filterStatus);

  const exportStayToPDF = () => {
    const doc = new jsPDF();
    doc.text("History of Stay", 14, 10);
    autoTable(doc, {
      head: [["Property", "From", "To"]],
      body: stayHistory.map((s) => [s.property, s.from, s.to]),
    });
    doc.save("stay-history.pdf");
    toast.success("Stay history exported as PDF");
  };

  const exportStayToCSV = () => {
    const csv = Papa.unparse(stayHistory);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "stay-history.csv";
    link.click();
    toast.success("Stay history exported as CSV");
  };

  const exportPaymentsToPDF = () => {
    const doc = new jsPDF();
    doc.text("History of Payments", 14, 10);
    autoTable(doc, {
      head: [["Invoice", "Invoice Date", "Payment Date", "Amount", "Status"]],
      body: filteredPayments.map((p) => [
        p.invoice,
        p.invoiceDate,
        p.paymentDate,
        p.amount,
        p.status,
      ]),
    });
    doc.save("payment-history.pdf");
    toast.success("Payment history exported as PDF");
  };

  const exportPaymentsToCSV = () => {
    const csv = Papa.unparse(filteredPayments);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "payment-history.csv";
    link.click();
    toast.success("Payment history exported as CSV");
  };

  const printSection = (sectionId: string) => {
    const content = document.getElementById(sectionId);
    if (content) {
      const win = window.open("", "", "width=900,height=700");
      if (win) {
        win.document.write("<html><head><title>Print</title></head><body>");
        win.document.write(content.innerHTML);
        win.document.write("</body></html>");
        win.document.close();
        win.print();
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tenant Profile</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-sm px-4 py-1 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      {/* Personal Details */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-500 text-sm">Full Name</label>
            <p className="text-lg font-semibold">{name?.replace(/%20/g, " ")}</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Email</label>
            <p className="text-lg">john@example.com</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Mobile Number</label>
            <p className="text-lg">9876543210</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Current Property</label>
            <p className="text-lg">Flat 101 - Green Residency</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Joining Date</label>
            <p className="text-lg">Jan 01, 2023</p>
          </div>
        </div>
      </div>

      {/* Stay History */}
      <div className="bg-white shadow rounded p-6" id="stay-section">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">History of Stay</h2>
          <div className="flex gap-2">
            <button onClick={() => printSection("stay-section")} className="border px-3 py-1 rounded text-sm">🖨 Print</button>
            <button onClick={exportStayToCSV} className="border px-3 py-1 rounded text-sm">Export CSV</button>
            <button onClick={exportStayToPDF} className="border px-3 py-1 rounded text-sm">Export PDF</button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th className="py-2">Property</th>
              <th className="py-2">From</th>
              <th className="py-2">To</th>
            </tr>
          </thead>
          <tbody>
            {stayHistory.map((stay, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{stay.property}</td>
                <td className="py-2">{stay.from}</td>
                <td className="py-2">{stay.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment History */}
      <div className="bg-white shadow rounded p-6" id="payment-section">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">History of Payments</h2>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <button onClick={() => printSection("payment-section")} className="border px-3 py-1 rounded text-sm">🖨 Print</button>
            <button onClick={exportPaymentsToCSV} className="border px-3 py-1 rounded text-sm">Export CSV</button>
            <button onClick={exportPaymentsToPDF} className="border px-3 py-1 rounded text-sm">Export PDF</button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th className="py-2">Invoice No.</th>
              <th className="py-2">Invoice Date</th>
              <th className="py-2">Payment Date</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.invoice} className="border-b">
                <td className="py-2 text-blue-600 hover:underline">
                  <Link to={`/admin/invoice/${p.invoice}`}>{p.invoice}</Link>
                </td>
                <td className="py-2">{p.invoiceDate}</td>
                <td className="py-2">{p.paymentDate}</td>
                <td className="py-2">{p.amount}</td>
                <td className={`py-2 ${p.status === "Paid" ? "text-green-600" : "text-yellow-600"}`}>
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
