import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

// Neutral home that redirects authenticated users to their portal
const HomeView = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    if (user?.role === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
    }
  }

  // Public landing for unauthenticated users
  return (
    <Box sx={{ py: 8 }}>
      <Paper sx={{ maxWidth: 800, mx: 'auto', p: 4, textAlign: 'center' }} elevation={2}>
        <Typography variant="h4" gutterBottom>
          Welcome to MediCare Network
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please choose your role to continue to the appropriate portal.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button component={Link} to="/login/doctor" variant="contained" color="primary">
            Doctor Login
          </Button>
          <Button component={Link} to="/login/patient" variant="outlined" color="primary">
            Patient Login
          </Button>
          <Button component={Link} to="/role-select" color="secondary">
            Role Selection
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HomeView;
