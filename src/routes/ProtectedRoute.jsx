import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if(isLoading) return <Loader text=""/>

  if (!user) {
    return <Navigate to="/login" replace />;
  }

if (allowedRoles && !allowedRoles.includes(user.role)) {
  return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
}

  return <Outlet />;
};

export default ProtectedRoute;
