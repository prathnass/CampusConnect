// Wrap any page in this component to require login (and optionally a
// specific role). If the check fails, the user is redirected instead of
// ever seeing the protected page — this is Challenge 1 & 2 from the brief.
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
