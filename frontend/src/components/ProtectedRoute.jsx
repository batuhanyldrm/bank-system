import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { isTokenValid } = useAuth();

  return isTokenValid() ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
