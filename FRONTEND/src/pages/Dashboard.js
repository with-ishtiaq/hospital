import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  Paper, 
  Typography 
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Search as SearchIcon,
  Assignment as RecordsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    appointments: { upcoming: 0, total: 0 },
    messages: { unread: 0, total: 0 },
    profileComplete: 0
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        appointments: { upcoming: 3, total: 12 },
        messages: { unread: 2, total: 24 },
        profileComplete: user?.role === 'doctor' ? 90 : 75
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const renderPatientDashboard = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Appointments
                </Typography>
              </Box>
              <Typography variant="body1">
                Upcoming: {stats.appointments.upcoming}
              </Typography>
              <Typography variant="body1">
                Total: {stats.appointments.total}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 2 }}
                onClick={() => handleNavigate('/patient/dashboard/appointments')}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MessageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Messages
                </Typography>
              </Box>
              <Typography variant="body1">
                Unread: {stats.messages.unread}
              </Typography>
              <Typography variant="body1">
                Total: {stats.messages.total}
              </Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                View Messages
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Profile
                </Typography>
              </Box>
              <Typography variant="body1">
                Complete: {stats.profileComplete}%
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 2 }}
                onClick={() => handleNavigate('/patient/dashboard/profile')}
              >
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<SearchIcon />}
              onClick={() => handleNavigate('/patient/dashboard/find-doctors')}
            >
              Find Doctors
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<CalendarIcon />}
              onClick={() => handleNavigate('/patient/dashboard/appointments')}
            >
              Book Appointment
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<RecordsIcon />}
              onClick={() => handleNavigate('/patient/dashboard/medical-records')}
            >
              Medical Records
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );

  const renderDoctorDashboard = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Today's Appointments
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.appointments.upcoming}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 2 }}
                onClick={() => handleNavigate('/doctor/dashboard/schedule')}
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MessageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Messages
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.messages.unread}
              </Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                View Messages
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Profile
                </Typography>
              </Box>
              <Typography variant="body1">
                Complete: {stats.profileComplete}%
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 2 }}
                onClick={() => handleNavigate('/doctor/dashboard/profile')}
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<CalendarIcon />}
              onClick={() => handleNavigate('/doctor/dashboard/schedule')}
            >
              View Schedule
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<PersonIcon />}
              onClick={() => handleNavigate('/doctor/dashboard/patients')}
            >
              My Patients
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<HospitalIcon />}
              onClick={() => handleNavigate('/doctor/dashboard/availability')}
            >
              Set Availability
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the admin dashboard. Use the navigation to manage the system.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
      >
        Logout
      </Button>
    </>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.firstName || 'User'}!
      </Typography>
      
      {user?.role === 'patient' && renderPatientDashboard()}
      {user?.role === 'doctor' && renderDoctorDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
        Last login: {new Date().toLocaleString()}
      </Typography>
    </Container>
  );
};

export default Dashboard;
