import React, { useState } from "react";
import { utils, writeFile } from "xlsx";

interface Tenant {
    name: string;
    email: string;
    mobile: string;
    property: string;
}

interface TenantTableProps {
    tenants: Tenant[];
    onEdit?: (tenant: Tenant, index: number) => void;
    onDelete?: (index: number) => void;
    onView?: (tenant: Tenant) => void;
    rowsPerPage?: number;
}

export default function TenantTable({ tenants, onEdit, onDelete, onView }: TenantTableProps) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginated = tenants.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(tenants.length / rowsPerPage);

  const exportToCSV = () => {
    const ws = utils.json_to_sheet(tenants);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Tenants");
    writeFile(wb, "tenants_export.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="text-sm">
          Show
          <select
            className="mx-2 px-2 py-1 border rounded"
            value={rowsPerPage}
            onChange={(e) => {
              setPage(1);
            }}
          >
            {[5, 10, 15, 20].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
          entries
        </div>
        <button
          onClick={exportToCSV}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Export
        </button>
      </div>

      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Mobile Number</th>
            <th className="px-4 py-2">Email ID</th>
            <th className="px-4 py-2">Property</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
            {paginated.map((tenant, idx) => (
                <tr key={idx} className="border-b">
                    <td
                        className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                        onClick={() => onView && onView(tenant)} // ✅ makes name clickable
                    >
                        {tenant.name}
                    </td>
                    <td className="px-4 py-2">{tenant.mobile}</td>
                    <td className="px-4 py-2">{tenant.email}</td>
                    <td className="px-4 py-2">{tenant.property}</td>
                    <td className="px-4 py-2 space-x-2">
                        <button onClick={() => onEdit && onEdit(tenant, idx)} className="text-blue-500 hover:underline">Edit</button>
                        <button onClick={() => onDelete && onDelete(idx)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">Page {page} of {pageCount}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
          disabled={page === pageCount}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
