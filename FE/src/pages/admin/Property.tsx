import { useState , useEffect} from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type definitions
interface Occupancy {
  tenant: string;
  from: string;
  to: string | null;
  rent: string;
}
interface Property {
  id: string;
  name: string;
  rent: number;
  frequency: string;
  occupancies: Occupancy[];
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [yearFilter, setYearFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState<number | "All">(5);

  const filteredProperties = properties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedProperties =
    resultsPerPage === "All"
      ? filteredProperties
      : filteredProperties.slice((page - 1) * resultsPerPage, page * resultsPerPage);

  const totalPages =
    resultsPerPage === "All" ? 1 : Math.ceil(filteredProperties.length / resultsPerPage);

  const filterOccupancies = (occupancies: Occupancy[]) =>
    occupancies.filter((o) => {
      const date = new Date(o.from);
      const matchYear = yearFilter === "All" || date.getFullYear().toString() === yearFilter;
      const matchMonth = monthFilter === "All" || date.getMonth() + 1 === parseInt(monthFilter);
      const matchFrom = !fromDate || date >= new Date(fromDate);
      const matchTo = !toDate || (o.to && new Date(o.to) <= new Date(toDate));
      return matchYear && matchMonth && matchFrom && matchTo;
    });

  const exportPDF = (occupancies: Occupancy[]) => {
    const doc = new jsPDF();
    doc.text("Previous Occupancies", 14, 14);
    autoTable(doc, {
      startY: 20,
      head: [["Tenant", "From", "To", "Rent"]],
      body: occupancies.map((o) => [o.tenant, o.from, o.to || "Present", o.rent]),
    });
    doc.save("occupancy-history.pdf");
  };

  const fetchProperties = async () => {
    try {
      const res = await API.get("/api/property");
      setProperties(res.data); // ⬅️ update state with fetched data
    } catch (err) {
      console.error("Error fetching properties", err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (property: Omit<Property, 'id'>) => {
    const res = await API.post('/api/property', property);
    return res.data;
  };

  const updateProperty = async (id: string, property: Omit<Property, 'id'>) => {
    const res = await API.put(`/api/property/${id}`, property);
    return res.data;
  };

  const deleteProperty = async (id: string) => {
    await API.delete(`/api/property/${id}`);
  };

  // HANDLER 

  const handleEditClick = (property: Property) => {
    setSelectedProperty(property);
    setShowAddModal(true);
  };  

// When Delete button is clicked
const handleDelete = async (id: string) => {
  if (confirm("Are you sure you want to delete this property?")) {
    await deleteProperty(id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }
};

const handleSaveProperty = async (e: React.FormEvent) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
  const rent = parseFloat((form.elements.namedItem("rent") as HTMLInputElement).value);
  const frequency = (form.elements.namedItem("frequency") as HTMLSelectElement).value;

  if (selectedProperty) {
    const updated = await updateProperty(selectedProperty.id, {
      name,
      rent,
      frequency,
      occupancies: selectedProperty.occupancies,
    });
    setProperties((prev) =>
      prev.map((p) => (p.id === selectedProperty.id ? updated : p))
    );
  } else {
    const newProperty = await addProperty({ name, rent, frequency, occupancies: [] });
    setProperties((prev) => [...prev, newProperty]);
  }

  setShowAddModal(false);
  setSelectedProperty(null);
};

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Property Management</h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search property"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-1 text-sm rounded"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            + Add Property
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm mb-2">
        <div className="flex items-center gap-2">
          Rows per page:
          <select
            value={resultsPerPage}
            onChange={(e) => {
              const val = e.target.value;
              setResultsPerPage(val === "All" ? "All" : parseInt(val));
              setPage(1);
            }}
            className="border px-2 py-1 rounded"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="All">All</option>
          </select>
        </div>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="py-2 px-3 text-left">Property Name</th>
            <th className="py-2 px-3 text-left">Rent</th>
            <th className="py-2 px-3 text-left">Frequency</th>
            <th className="py-2 px-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProperties.map((property) => (
            <tr key={property.id} className="border-b">
              <td
                className="px-3 py-2 text-blue-600 hover:underline cursor-pointer"
                onClick={() => setSelectedProperty(property)}
              >
                {property.name}
              </td>
              <td className="px-3 py-2">{property.rent}</td>
              <td className="px-3 py-2">{property.frequency}</td>
              <td className="px-3 py-2">
              <button
                    className="text-blue-600 mr-2 text-sm"
                    onClick={() => handleEditClick(property)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 text-sm"
                    onClick={() => handleDelete(property.id)}
                  >
                    Delete
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {resultsPerPage !== "All" && (
        <div className="flex justify-between items-center text-sm mt-3">
          <div>
            Showing {(page - 1) * resultsPerPage + 1}–
            {Math.min(page * resultsPerPage, filteredProperties.length)} of{" "}
            {filteredProperties.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="border px-3 py-1 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="border px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        {selectedProperty ? "Edit Property" : "Add Property"}
      </h2>
      <form onSubmit={handleSaveProperty} className="space-y-4">
        <input
          name="name"
          type="text"
          required
          placeholder="Property Name"
          defaultValue={selectedProperty?.name || ""}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="rent"
          type="text"
          required
          placeholder="Rent Amount"
          defaultValue={selectedProperty?.rent || ""}
          className="w-full border rounded px-3 py-2"
        />
        <select
          name="frequency"
          required
          defaultValue={selectedProperty?.frequency || ""}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Frequency</option>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
        </select>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setShowAddModal(false);
              setSelectedProperty(null);
            }}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Occupancy Modal */}
      {/* {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl relative space-y-4">
            <h2 className="text-xl font-semibold">
              {selectedProperty.name} – Occupancy Details
            </h2>
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <div>
              <h3 className="font-semibold mb-1">Current Occupant</h3>
              {selectedProperty.occupancies.find((o) => o.to === null) ? (
                <p className="text-sm">
                  {
                    selectedProperty.occupancies.find((o) => o.to === null)?.tenant
                  }{" "}
                  — From{" "}
                  {
                    selectedProperty.occupancies.find((o) => o.to === null)?.from
                  }
                </p>
              ) : (
                <p className="text-sm text-gray-500">No current occupant</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="border px-3 py-1 rounded text-sm"
                >
                  <option value="All">All Years</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="border px-3 py-1 rounded text-sm"
                >
                  <option value="All">All Months</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", { month: "short" })}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
                />
                <button
                  onClick={() =>
                    exportPDF(filterOccupancies(selectedProperty.occupancies))
                  }
                  className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
                >
                  Export PDF
                </button>
              </div>

              <h3 className="font-semibold mt-4">Previous Occupants</h3>
              <table className="w-full text-sm border mt-2">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="py-2 px-3 text-left">Tenant</th>
                    <th className="py-2 px-3 text-left">From</th>
                    <th className="py-2 px-3 text-left">To</th>
                    <th className="py-2 px-3 text-left">Rent</th>
                  </tr>
                </thead>
                <tbody>
                  {filterOccupancies(selectedProperty.occupancies)
                    .filter((o) => o.to !== null)
                    .map((o, i) => (
                                             <tr key={i} className="border-b">
                          <td className="px-3 py-2">{o.tenant}</td>
                          <td className="px-3 py-2">{o.from}</td>
                          <td className="px-3 py-2">{o.to || "Present"}</td>
                          <td className="px-3 py-2">{o.rent}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
