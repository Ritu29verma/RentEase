import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InvoiceDetail() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const invoice = {
    invoiceNumber: invoiceId,
    tenantName: "John Doe",
    property: {
      name: "Flat 101 - Green Residency",
      rent: 12000,
      frequency: "Monthly",
    },
    duration: {
      from: "Apr 01, 2024",
      to: "Apr 30, 2024",
    },
    invoiceDate: "Apr 01, 2024",
    dueDate: "Apr 05, 2024",
    paymentDate: "Apr 05, 2024",
    status: "Paid",
  };

  const handlePrint = () => {
    const content = document.getElementById("invoice-section");
    if (content) {
      const win = window.open("", "", "width=900,height=700");
      if (win) {
        win.document.write("<html><head><title>Invoice</title></head><body>");
        win.document.write(content.innerHTML);
        win.document.write("</body></html>");
        win.document.close();
        win.print();
      }
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Invoice Details", 14, 14);

    autoTable(doc, {
      startY: 20,
      head: [["Field", "Value"]],
      body: [
        ["Invoice No.", invoice.invoiceNumber || ""],
        ["Tenant Name", invoice.tenantName || ""],
        ["Property", invoice.property?.name || ""],
        ["Rent", `₹${invoice.property?.rent || 0}`],
        ["Frequency", invoice.property?.frequency || ""],
        ["Invoice From", invoice.duration?.from || ""],
        ["Invoice To", invoice.duration?.to || ""],
        ["Invoice Date", invoice.invoiceDate || ""],
        ["Due Date", invoice.dueDate || ""],
        ["Payment Date", invoice.paymentDate || ""],
        ["Status", invoice.status || ""],
        ["Total Amount", `₹${invoice.property?.rent || 0}`],
      ],
    });

    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-white shadow rounded">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoice Details</h1>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-gray-100 text-sm px-4 py-1 rounded hover:bg-gray-200"
          >
            🖨 Print
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-gray-100 text-sm px-4 py-1 rounded hover:bg-gray-200"
          >
            📄 Export PDF
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 text-sm px-4 py-1 rounded hover:bg-gray-200"
          >
            ← Back
          </button>
        </div>
      </div>

      <div id="invoice-section" className="space-y-4">
        {/* Tenant Info */}
        <div>
          <h2 className="font-semibold text-lg">Tenant Information</h2>
          <p className="text-sm text-gray-600">Name: {invoice.tenantName}</p>
        </div>

        {/* Property Info */}
        <div>
          <h2 className="font-semibold text-lg">Property Details</h2>
          <p className="text-sm text-gray-600">
            {invoice.property.name} – ₹{invoice.property.rent} / {invoice.property.frequency}
          </p>
        </div>

        {/* Invoice Duration */}
        <div>
          <h2 className="font-semibold text-lg">Invoice Duration</h2>
          <p className="text-sm text-gray-600">
            {invoice.duration.from} → {invoice.duration.to}
          </p>
        </div>

        {/* Dates & Status */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-500 text-sm">Invoice Date</label>
            <p>{invoice.invoiceDate}</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Due Date</label>
            <p>{invoice.dueDate}</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Payment Date</label>
            <p>{invoice.paymentDate}</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Status</label>
            <p className={invoice.status === "Paid" ? "text-green-600" : "text-red-600"}>
              {invoice.status}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <h2 className="font-semibold text-lg">Total Amount</h2>
          <p className="text-2xl font-bold text-gray-800">₹{invoice.property.rent}</p>
        </div>
      </div>
    </div>
  );
}
