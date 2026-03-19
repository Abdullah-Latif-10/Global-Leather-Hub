import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-border border-t-tan rounded-full animate-spin" />
          <p className="text-fog text-xs tracking-[0.2em] uppercase font-medium">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
