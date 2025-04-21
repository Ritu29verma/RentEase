import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Tenants", path: "/admin/tenants" },
  { name: "Property", path: "/admin/properties" },
  { name: "Payments", path: "/admin/payments" },
  // { name: "Reminders", path: "/admin/reminders" },
  { name: "Settings", path: "/admin/settings" },

];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
      <div className="p-6 text-2xl font-bold border-b">Admin</div>
      <nav className="flex-1 px-4 py-6 space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded hover:bg-gray-100 ${
              pathname === item.path ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}