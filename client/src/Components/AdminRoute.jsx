import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminRoute({ children }) {
  const { userInfo } = useSelector((state) => state.auth);

  // If not logged in → redirect to login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not an admin → redirect to homepage
  if (userInfo.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Otherwise allow access
  return children;
}

export default AdminRoute;
