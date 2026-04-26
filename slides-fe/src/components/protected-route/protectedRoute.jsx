import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../services/apis/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 