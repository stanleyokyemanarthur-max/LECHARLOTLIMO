// Components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, allowedRoles }) {
  const { userInfo, token, status } = useSelector((s) => s.auth);

  // No token → must log in
  if (!token) return <Navigate to="/login" replace />;

  // We're restoring session (fetchUserFromToken)
  if (!userInfo && status === "loading") return <div>Loading...</div>;

  // If fetch failed or user not present → go to login
  if (!userInfo && status === "failed") return <Navigate to="/login" replace />;

  // If we still don't have userInfo (unlikely) show loading
  if (!userInfo) return <div>Loading...</div>;

  // Role check if provided
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
