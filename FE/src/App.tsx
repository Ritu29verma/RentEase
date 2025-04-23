import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import TenantLayout from "./pages/TenantLayout";
import AdminLayout from "./pages/AdminLayout"; 
import UnifiedLogin from "./pages/UnifiedLogin";
import LandingPage from "./pages/LandingPage";

// Tenant Pages
import TenantDashboard from "./pages/tenant/Dashboard";
import TenantInvoices from "./pages/tenant/Invoices";
import RentSchedule from "./pages/tenant/RentSchedule";
import MyProperty from "./pages/tenant/MyProperty";
import TenantSelfProfile from "./pages/tenant/Profile";
import SetPassword from "./pages/tenant/SetPassword";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Tenants from "./pages/admin/Tenants";
import Properties from "./pages/admin/Property";
import Payments from "./pages/admin/Payments";
import Settings from "./pages/admin/Settings";
import TenantProfile from "./pages/admin/TenantProfile";
import InvoiceDetails from "./pages/admin/InvoiceDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UnifiedLogin />} />

        {/* ✅ Tenant Panel */}
        <Route element={<ProtectedRoute allowedRole="tenant" />}>
        <Route path="/tenant" element={<TenantLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TenantDashboard />} />
          <Route path="invoices" element={<TenantInvoices />} />
          <Route path="rent-schedule" element={<RentSchedule />} />
          <Route path="my-property" element={<MyProperty />} />
          <Route path="profile" element={<TenantSelfProfile />} />
        </Route>
        </Route>

        <Route path="/tenant/set-password/:token" element={<SetPassword />} />

        {/* ✅ Admin Panel */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="properties" element={<Properties />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tenant-profile/:name" element={<TenantProfile />} />
          <Route path="invoice/:id" element={<InvoiceDetails />} />
        </Route>
        </Route>
      </Routes>
    </Router>
  );
}
