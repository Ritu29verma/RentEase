import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Tenants", path: "/admin/tenants" },
    { name: "Properties", path: "/admin/properties" },
    { name: "Payments", path: "/admin/payments" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 p-4 space-y-6 z-50 transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed md:relative md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Admin Panel</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-white text-black font-semibold" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar with menu toggle for mobile */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-700 text-2xl">
            <FiMenu />
          </button>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>

        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
