import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Case 1: Admin user on the root path should be redirected to /admin/dashboard
  if (isAuthenticated && user?.role === "admin" && location.pathname === "/") {
    return <Navigate to="/admin/dashboard" />;
  }

  // Case 2: Non-admin user tries to access admin routes, redirect them to /
  if (
    location.pathname.startsWith("/admin") &&
    (!isAuthenticated || user?.role !== "admin")
  ) {
    return <Navigate to="/" />;
  }

  // Case 3: Allow other paths or authenticated normal user access
  return children;
}

export default CheckAuth;
