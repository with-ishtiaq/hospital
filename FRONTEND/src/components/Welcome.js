import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#aef9e4', // Greenish white background
        color: '#2e7d32', // Dark green text
        textAlign: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              mb: 4,
            }}
          >
            <MedicalServicesIcon sx={{ fontSize: 80, color: '#4CAF50' }} />
            <PersonIcon sx={{ fontSize: 80, color: '#4CAF50' }} />
          </Box>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome To
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              color: '#4CAF50',
              mb: 2
            }}
          >
            OFTEN
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, color: '#e0e0e0' }}>
            Your health Our Priority
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300, mx: 'auto' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#45a049' },
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': { 
                borderColor: '#e0e0e0',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              },
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Welcome;
