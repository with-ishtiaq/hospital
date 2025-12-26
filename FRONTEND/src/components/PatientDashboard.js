import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Tabs, 
  Tab,
  Button,
} from '@mui/material';
import { 
  Person, 
  MedicalServices, 
  EventNote as EventNoteIcon, 
  Search as SearchIcon, 
  Folder as FolderIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import tab components
import AppointmentsTab from './dashboard/AppointmentsTab';
import FindDoctorsTab from './dashboard/FindDoctorsTab';
import MedicalRecordsTab from './dashboard/MedicalRecordsTab';
import PersonalInfoTab from './dashboard/PersonalInfoTab';
import HospitalOptionsTab from './dashboard/HospitalOptionsTab';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f8f0', py: 3 }}>
      {/* Header */}
      <Box sx={{ backgroundColor: '#1976d2', color: 'white', py: 2, mb: 4, boxShadow: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={handleBackToDashboard}
                size="small"
              >
                Back to Dashboard
              </Button>
              <MedicalServices sx={{ fontSize: 32 }} />
              <Typography variant="h5" component="h1">Patient Dashboard</Typography>
            </Box>
            <Button color="inherit" sx={{ textTransform: 'none' }}>
              <Person sx={{ mr: 1 }} /> My Profile
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Paper elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{
              '& .MuiTabs-flexContainer': {
                gap: 3,
                px: 2,
                py: 1
              },
              '& .MuiTab-root': {
                minHeight: 64,
                '&.Mui-selected': {
                  fontWeight: 600
                }
              },
              '& .MuiTabs-indicator': {
                height: '4px',
                borderRadius: '2px 2px 0 0'
              }
            }}
          >
            <Tab icon={<EventNoteIcon />} label="My Appointments" />
            <Tab icon={<SearchIcon />} label="Find Doctors" />
            <Tab icon={<FolderIcon />} label="Medical Records" />
            <Tab icon={<Person />} label="Personal Info" />
            <Tab icon={<HospitalIcon />} label="Hospital Options" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {currentTab === 0 && <AppointmentsTab />}
            {currentTab === 1 && <FindDoctorsTab />}
            {currentTab === 2 && <MedicalRecordsTab />}
            {currentTab === 3 && <PersonalInfoTab />}
            {currentTab === 4 && <HospitalOptionsTab />}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PatientDashboard;
