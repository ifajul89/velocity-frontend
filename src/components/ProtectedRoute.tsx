import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

// Define user type to match in authSlice
interface User {
  id?: string;
  email?: string;
  role?: string;
}

// Protected route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requireAdmin?: boolean;
}> = ({ children, requireAdmin = false }) => {
  const { user, token } = useAppSelector((state) => state.auth);
  
  const isAuthenticated = !!token;
  const isAdmin = user && (user as User).role === "admin";
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute; 