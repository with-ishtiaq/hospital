import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // If user is already authenticated, redirect to the home page or intended page
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  // If not authenticated, render the public route
  return children;
};

export default PublicRoute;
