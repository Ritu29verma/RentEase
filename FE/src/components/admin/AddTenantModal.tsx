// File: src/components/admin/AddTenantModal.tsx
import React, { useState, useEffect } from "react";
import Select from "react-select";

interface Property {
  id: string;
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
    defaultData || { name: "", email: "", mobile: "", property: "" }
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
      setFormData({ name: "", email: "", mobile: "", property: "" });
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
            defaultValue={
              formData.property
                ? { label: formData.property, value: formData.property }
                : null
            }
            onChange={(selected) =>
              setFormData({ ...formData, property: selected?.label || "" })
            }
            placeholder="Select Property"
            isSearchable
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
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
