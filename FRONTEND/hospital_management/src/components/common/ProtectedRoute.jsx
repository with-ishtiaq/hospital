import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading...</Typography>
      </Container>
    );
  }

  // Handle errors
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography color="error" variant="h6" gutterBottom>
          Authentication Error
        </Typography>
        <Typography color="text.secondary" paragraph>
          {error}
        </Typography>
      </Container>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Store the attempted URL for redirecting after login
    const redirectUrl = `${location.pathname}${location.search}`;
    const lastRole = localStorage.getItem('lastRole');
    const loginPath = lastRole ? `/login/${lastRole}` : '/role-select';
    return (
      <Navigate 
        to={loginPath}
        replace 
        state={{ 
          from: location,
          message: 'Please log in to access this page.',
          redirectUrl: redirectUrl !== '/' ? redirectUrl : undefined
        }} 
      />
    );
  }

  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <Navigate 
        to="/unauthorized" 
        replace 
        state={{ 
          from: location,
          message: 'You do not have permission to access this page.'
        }} 
      />
    );
  }

  return children;
};

export default ProtectedRoute;
