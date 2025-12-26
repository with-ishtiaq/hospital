import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Tabs, 
  Tab,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Badge
} from '@mui/material';
import { 
  MedicalServices, 
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DoctorAppointments from './doctor/DoctorAppointments';

const DoctorDashboard = () => {
  const [currentTab, setCurrentTab] = useState('appointments');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <MedicalServices sx={{ mr: 2 }} color="primary" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Doctor Dashboard
          </Typography>
          
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={2} color="error">
              <MessageIcon />
            </Badge>
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
              {user?.name?.charAt(0) || <PersonIcon />}
            </Avatar>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Dr. {user?.name || 'User'}
            </Typography>
            <IconButton onClick={handleLogout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
        
        {/* Secondary Toolbar with Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            aria-label="doctor dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontWeight: 'medium',
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 'bold'
                }
              }
            }}
          >
            <Tab 
              value="appointments" 
              label="Appointments" 
              icon={<CalendarIcon />} 
              iconPosition="start" 
            />
            <Tab 
              value="patients" 
              label="My Patients" 
              icon={<PersonIcon />} 
              iconPosition="start" 
            />
            <Tab 
              value="schedule" 
              label="Schedule" 
              icon={<CalendarIcon />} 
              iconPosition="start" 
            />
            <Tab 
              value="profile" 
              label="Profile" 
              icon={<PersonIcon />} 
              iconPosition="start" 
            />
            <Tab 
              value="settings" 
              label="Settings" 
              icon={<SettingsIcon />} 
              iconPosition="start" 
            />
          </Tabs>
        </Box>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ flex: 1, py: 3, backgroundColor: '#f5f5f5' }}>
        {currentTab === 'appointments' && <DoctorAppointments />}
        {currentTab === 'patients' && (
          <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>My Patients</Typography>
            <Typography>Patients list will be displayed here</Typography>
          </Box>
        )}
        {currentTab === 'schedule' && (
          <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>My Schedule</Typography>
            <Typography>Schedule calendar will be displayed here</Typography>
          </Box>
        )}
        {currentTab === 'profile' && (
          <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>My Profile</Typography>
            <Typography>Profile information will be displayed here</Typography>
          </Box>
        )}
        {currentTab === 'settings' && (
          <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Settings</Typography>
            <Typography>Settings will be displayed here</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DoctorDashboard;
