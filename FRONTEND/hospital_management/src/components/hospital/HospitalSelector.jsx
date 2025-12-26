import React, { useState, useEffect } from 'react';
import { useHospital } from '../../contexts/HospitalContext';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress,
  Typography,
  Alert,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const HospitalSelector = () => {
  const { 
    selectedHospital, 
    hospitals, 
    loading, 
    error, 
    selectHospital 
  } = useHospital();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [localLoading, setLocalLoading] = useState(true);
  
  // Handle hospital change
  const handleHospitalChange = (event) => {
    const hospitalId = event.target.value;
    const hospital = hospitals.find(h => h._id === hospitalId);
    if (hospital) {
      selectHospital(hospital);
    }
  };

  // Show loading state briefly to prevent layout shift
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setLocalLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (localLoading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (hospitals.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No hospitals available. Please contact support.
      </Alert>
    );
  }

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Select Hospital
        </Typography>
      </Box>
      
      <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
        {!isMobile && <InputLabel id="hospital-select-label">Hospital</InputLabel>}
        <Select
          labelId="hospital-select-label"
          id="hospital-select"
          value={selectedHospital?._id || ''}
          onChange={handleHospitalChange}
          label={!isMobile ? 'Hospital' : ''}
          displayEmpty
          fullWidth
          variant={isMobile ? 'outlined' : 'filled'}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          {hospitals.map((hospital) => (
            <MenuItem key={hospital._id} value={hospital._id}>
              <Box display="flex" alignItems="center" width="100%">
                <LocalHospitalIcon 
                  color="primary" 
                  sx={{ 
                    mr: 1, 
                    fontSize: '1.2rem',
                    color: theme.palette.primary.main
                  }} 
                />
                <Box>
                  <Typography variant="body1" component="div">
                    {hospital.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {hospital.address?.city}, {hospital.address?.state}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {selectedHospital && (
        <Box mt={1} pl={1}>
          <Typography variant="caption" color="textSecondary">
            Currently selected: <strong>{selectedHospital.name}</strong>
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default HospitalSelector;
