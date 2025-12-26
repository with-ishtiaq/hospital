import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireProfileComplete = true }) => {
  const { isAuthenticated, isProfileComplete, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading indicator while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If profile needs to be complete but isn't, redirect to profile setup
  if (requireProfileComplete && !isProfileComplete && !location.pathname.includes('profile-setup')) {
    return <Navigate to={`/${user.userType}/profile-setup`} state={{ from: location }} replace />;
  }

  // If profile is complete but user is on profile setup page, redirect to dashboard
  if (isProfileComplete && location.pathname.includes('profile-setup')) {
    return <Navigate to={`/${user.userType}/dashboard`} replace />;
  }

  // If user is trying to access a route not meant for their user type, redirect to their dashboard
  const userType = location.pathname.split('/')[1];
  if (userType !== user.userType && (userType === 'doctor' || userType === 'patient')) {
    return <Navigate to={`/${user.userType}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
