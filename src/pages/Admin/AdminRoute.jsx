import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const AdminRoute = () => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but NOT admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin allowed
  return <Outlet />;
};

export default AdminRoute;