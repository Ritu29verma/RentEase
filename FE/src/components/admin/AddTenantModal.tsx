// File: src/components/admin/AddTenantModal.tsx
import React, { useState, useEffect } from "react";
import Select from "react-select";

export interface Property {
  id: number;
  name: string;
  rent: number;
  frequency: string;
}

export interface TenantFormData {
  id?: number;
  name: string;
  email: string;
  mobile: string;
  property: string;
  propertyid: number;
}

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tenant: TenantFormData) => void;
  properties: Property[];
  defaultData?: TenantFormData;
}

export default function AddTenantModal({
  isOpen,
  onClose,
  onSubmit,
  properties,
  defaultData,
}: AddTenantModalProps) {
  const [formData, setFormData] = useState<TenantFormData>(
    defaultData || { name: "", email: "", mobile: "", property: "", propertyid:0 }
  );

  useEffect(() => {
    if (defaultData) {
      setFormData(defaultData);
    }
  }, [defaultData]);

  const propertyOptions = properties.map((prop) => ({
    value: prop.id,
    label: `${prop.name} - ₹${prop.rent} (${prop.frequency})`,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.mobile && formData.property) {
      onSubmit(formData);
      onClose();
      setFormData({ name: "", email: "", mobile: "", property: "", propertyid: 0});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {defaultData ? "Edit Tenant" : "Add Tenant"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="w-full border rounded px-4 py-2"
            required
          />
          <Select
          options={propertyOptions}
          value={
            formData.propertyid
              ? propertyOptions.find((opt) => opt.value === formData.propertyid)
              : null
          }
          onChange={(selected) => {
            if (selected) {
              const selectedProperty = properties.find((p) => p.id === selected.value);
              setFormData({
                ...formData,
                propertyid: Number(selected.value),
                property: selectedProperty?.name || "",
              });
            } else {
              setFormData({ ...formData, propertyid: 0, property: "" });
            }
          }}
          placeholder="Select Property"
          isSearchable
        />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={()=>{
                onClose();
                setFormData({ name: "", email: "", mobile: "", property: "", propertyid:0 });
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              {defaultData ? "Update Tenant" : "Save Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
