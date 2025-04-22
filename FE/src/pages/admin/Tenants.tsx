// File: src/pages/admin/Tenants.tsx
import React, { useState,useEffect } from "react";
import AddTenantModal, { TenantFormData, Property } from "../../components/admin/AddTenantModal";
import TenantTable from "../../components/admin/TenantTable";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";



export default function Tenants() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tenantList, setTenantList] = useState<TenantFormData[]>([]);
  const [propertyList, setPropertyList] = useState<Property[]>([]);

  const [search, setSearch] = useState("");
  const [editingTenantIndex, setEditingTenantIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const fetchTenants = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tenants`);
      const formatted = res.data.map((t: any) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        mobile: t.mobile,
        property: t.Property?.name || "N/A",
      }));
      setTenantList(formatted);
    } catch (error) {
      toast.error("Failed to load tenants");
    }
  };
  useEffect(() => {
    fetchTenants();

    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/property`);
        setPropertyList(res.data);
      } catch (error) {
        toast.error("Failed to load properties");
      }
    };
  
    fetchProperties();
  }, []);

  const handleAddOrUpdateTenant = async (tenant: TenantFormData) => {
    try {
      const payload = {
        name: tenant.name,
        email: tenant.email,
        mobile: tenant.mobile,
        propertyId: tenant.property,
      };
  
      if (editingTenantIndex !== null && tenantList[editingTenantIndex].id) {
        // Update existing tenant
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/tenants/${tenantList[editingTenantIndex].id}`,
          payload
        );
        toast.success("Tenant updated successfully!");
      } else {
        // Add new tenant
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tenants`, payload);
        toast.success("Tenant added successfully!");
      }
  
      setModalOpen(false);
      setEditingTenantIndex(null);
      fetchTenants();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save tenant");
    }
  };
  
  
  

  const handleEditTenant = (tenant: TenantFormData, index: number) => {
    setEditingTenantIndex(index);
    setModalOpen(true);
  };

  const handleDeleteTenant = async (index: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tenant?");
    if (!confirmDelete) return;
  
    try {
      const tenantId = tenantList[index].id;
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/tenants/${tenantId}`);
      toast.success("Tenant deleted successfully!");
  
      // Refresh list
      fetchTenants();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete tenant");
    }
  };  
  

  const handleViewProfile = (tenant: TenantFormData) => {
    navigate(`/admin/tenant-profile/${encodeURIComponent(tenant.id!)}`);
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Top Cards and Controls */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-sm text-gray-500">Recent Tenants</h3>
            <p className="text-xl font-bold">{tenantList.slice(0, 5).length}</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-sm text-gray-500">Total Tenants</h3>
            <p className="text-xl font-bold">{tenantList.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <button
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            onClick={() => {
              setModalOpen(true);
              setEditingTenantIndex(null);
            }}
          >
            + Add Tenant
          </button>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Tenant List</h3>
        <TenantTable
          tenants={tenantList.filter(t =>
            `${t.name} ${t.email} ${t.mobile}`.toLowerCase().includes(search.toLowerCase())
          )}
          onEdit={handleEditTenant}
          onDelete={handleDeleteTenant}
          onView={handleViewProfile}
        />
      </div>

      <AddTenantModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTenantIndex(null);
        }}
        onSubmit={handleAddOrUpdateTenant}
        properties={propertyList}
        defaultData={editingTenantIndex !== null ? tenantList[editingTenantIndex] : undefined}
      />
    </div>
  );
}
