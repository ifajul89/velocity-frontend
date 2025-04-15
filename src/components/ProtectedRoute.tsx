import React, { useEffect, useState } from "react";
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
  const { user, token: reduxToken } = useAppSelector((state) => state.auth);
  const [token, setToken] = useState<string | null>(reduxToken);

  // Check localStorage for token if not in Redux
  useEffect(() => {
    if (!reduxToken) {
      const localToken = localStorage.getItem('token');
      if (localToken) {
        setToken(localToken);
      }
    }
  }, [reduxToken]);

  const isAuthenticated = !!token;
  const isAdmin = user && (user as User).role === "admin";

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If this route requires admin privileges and user is not admin, redirect to home
  if (requireAdmin && !isAdmin) {
    console.log("Unauthorized access attempt: Regular user tried to access admin route");
    return <Navigate to="/" replace />;
  }

  // Allow all authenticated users (including admins) to access non-admin routes
  return <>{children}</>;
};

export default ProtectedRoute;
