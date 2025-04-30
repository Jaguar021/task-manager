// src/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!userData || !userData.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && userData.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
