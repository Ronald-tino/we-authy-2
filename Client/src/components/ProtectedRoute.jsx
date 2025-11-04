import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute component
 * Ensures user is authenticated and has completed their profile
 * Redirects to appropriate pages if requirements are not met
 */
const ProtectedRoute = ({ children }) => {
  const { firebaseUser, mongoUser, loading, isProfileComplete } = useAuth();
  const location = useLocation();

  // Show nothing while loading
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        color: "#16db65"
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but profile incomplete - redirect to complete-profile
  if (!isProfileComplete()) {
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }

  // User is authenticated and profile is complete - render children
  return <>{children}</>;
};

export default ProtectedRoute;

