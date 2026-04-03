import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading, adminOverride, isAdmin } = useAuth();

  if (loading) {
    return null;
  }

  if (adminOverride || isAdmin || user?.role === "admin") {
    return children;
  }

  return <Navigate to="/admin/login" replace />;
}

export default AdminRoute;