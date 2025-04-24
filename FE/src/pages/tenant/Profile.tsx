
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function TenantSelfProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  // Replace with real tenant ID or from token/session
  const tenantId = 1;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tenants/${tenantId}`);
        const { name, email, mobile } = res.data;
        setForm({ name, email, mobile });
      } catch (err: any) {
        toast.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.mobile.length > 10) {
      toast.error("Mobile number cannot exceed 10 digits");
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/tenants/${tenantId}`, form);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="space-y-4">
      <ToastContainer />
      <h1 className="text-xl font-bold">My Profile</h1>
      <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            className="border px-3 py-2 rounded w-full"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="border px-3 py-2 rounded w-full"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mobile</label>
          <input
            type="text"
            name="mobile"
            className="border px-3 py-2 rounded w-full"
            value={form.mobile}
            onChange={handleChange}
          />
        </div>
        <button className="bg-black text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
}