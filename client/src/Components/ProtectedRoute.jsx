import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, allowedRoles }) {
  const { userInfo } = useSelector((state) => state.auth);

  // ⛔ If not logged in → redirect to login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Check user role
  const userRole = userInfo.user?.role || userInfo.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect unauthorized users to home or error page
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized → show the requested page
  return children;
}

export default ProtectedRoute;
