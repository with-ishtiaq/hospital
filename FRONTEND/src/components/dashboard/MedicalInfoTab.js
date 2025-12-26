import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { School, MedicalServices } from '@mui/icons-material';

const MedicalInfoTab = ({ medicalInfo }) => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School color="primary" /> Medical Education
              </Typography>
              
              <Box sx={{ '& > *': { mb: 1.5 } }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Medical School</Typography>
                  <Typography>{medicalInfo.university}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Degree</Typography>
                  <Typography>{medicalInfo.degree}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Graduation Year</Typography>
                  <Typography>{medicalInfo.graduationYear}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicalServices color="primary" /> Professional Information
              </Typography>
              
              <Box sx={{ '& > *': { mb: 1.5 } }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">License Number</Typography>
                  <Typography>{medicalInfo.licenseNumber}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Specialization</Typography>
                  <Typography>{medicalInfo.specialization}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Years of Experience</Typography>
                  <Typography>{medicalInfo.yearsOfExperience} years</Typography>
                </Box>
              </Box>
              
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ 
                  mt: 'auto',
                  py: 1.5,
                  fontSize: '1rem',
                  textTransform: 'none'
                }}
                fullWidth
              >
                Edit Information
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MedicalInfoTab;
