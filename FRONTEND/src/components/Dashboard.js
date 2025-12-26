import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // This would typically come from your auth context or state
  const userType = 'patient'; // or 'doctor' based on the user

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f0f8f0',
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          py: 2,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              OFTEN
            </Typography>
            <Button component={Link} to="/" variant="outlined" color="inherit">
              Sign Out
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h4" component="h2" sx={{ mb: 4, color: '#000' }}>
            Welcome to Your {userType === 'doctor' ? 'Doctor' : 'Patient'} Dashboard
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>Quick Actions</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {userType === 'doctor' ? (
                <>
                  <Button variant="contained" color="primary" component={Link} to="/appointments">
                    View Appointments
                  </Button>
                  <Button variant="outlined" component={Link} to="/patients">
                    My Patients
                  </Button>
                  <Button variant="outlined" component={Link} to="/schedule">
                    Set Availability
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" color="primary" component={Link} to="/book-appointment">
                    Book Appointment
                  </Button>
                  <Button variant="outlined" component={Link} to="/my-appointments">
                    My Appointments
                  </Button>
                  <Button variant="outlined" component={Link} to="/find-doctor">
                    Find a Doctor
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Recent Activity Section */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>Recent Activity</Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography>No recent activity</Typography>
              <Typography variant="body2" color="text.secondary">
                Your recent activities will appear here
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          mt: 4,
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} OFTEN. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
