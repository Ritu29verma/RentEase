import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }: { allowedRole: string }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
