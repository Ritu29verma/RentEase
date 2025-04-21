import { Link, Outlet, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/tenant/dashboard" },
  { label: "My Invoices", path: "/tenant/invoices" },
  { label: "Rent Schedule", path: "/tenant/rent-schedule" },
  { label: "My Property", path: "/tenant/my-property" },
  { label: "Profile", path: "/tenant/profile" },
];

export default function TenantLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r hidden md:block">
        <h1 className="text-xl font-bold mb-6">Tenant Panel</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded ${
                location.pathname === item.path
                  ? "bg-black text-white"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white p-6">
        <div className="md:hidden mb-4">
          <select
            value={location.pathname}
            onChange={(e) => window.location.replace(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            {menuItems.map((item) => (
              <option key={item.path} value={item.path}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
