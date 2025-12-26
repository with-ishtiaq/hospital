import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Medication as MedicationIcon,
  EventNote as AppointmentIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Bloodtype as BloodTypeIcon,
  Scale as WeightIcon,
  Height as HeightIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const PatientLanding = () => {
  // Mock data - in a real app, this would come from an API
  const patientInfo = {
    name: 'John Doe',
    age: 35,
    bloodGroup: 'A+',
    weight: '70 kg',
    height: '175 cm',
    lastVisit: '2025-07-05',
    nextAppointment: '2025-08-10',
    allergies: ['Peanuts', 'Penicillin'],
    currentMedications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', for: 'Blood Pressure' },
      { name: 'Albuterol', dosage: '90mcg', frequency: 'As needed', for: 'Asthma' }
    ],
    recentPrescriptions: [
      { id: 1, date: '2025-07-01', doctor: 'Dr. Sarah Johnson', status: 'Active' },
      { id: 2, date: '2025-06-15', doctor: 'Dr. Michael Chen', status: 'Completed' }
    ]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Welcome back, {patientInfo.name}!</Typography>
      
      <Grid container spacing={3}>
        {/* Patient Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              My Health Summary
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><BloodTypeIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Blood Group" secondary={patientInfo.bloodGroup} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon><WeightIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Weight" secondary={patientInfo.weight} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon><HeightIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Height" secondary={patientInfo.height} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon><WarningIcon color={patientInfo.allergies.length > 0 ? 'error' : 'primary'} /></ListItemIcon>
                <ListItemText 
                  primary="Allergies" 
                  secondary={patientInfo.allergies.length > 0 ? patientInfo.allergies.join(', ') : 'No known allergies'} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                Upcoming Appointments
              </Typography>
              <Button size="small" color="primary">View All</Button>
            </Box>
            {patientInfo.nextAppointment ? (
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Next Appointment</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {new Date(patientInfo.nextAppointment).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    With: <strong>Dr. Sarah Johnson</strong>
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Typography variant="body2" color="textSecondary">No upcoming appointments</Typography>
            )}
          </Paper>
        </Grid>

        {/* Current Medications */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <MedicationIcon color="primary" sx={{ mr: 1 }} />
              Current Medications
            </Typography>
            {patientInfo.currentMedications.length > 0 ? (
              <List dense>
                {patientInfo.currentMedications.map((med, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={med.name}
                        secondary={`${med.dosage} • ${med.frequency} • For: ${med.for}`}
                      />
                    </ListItem>
                    {index < patientInfo.currentMedications.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">No current medications</Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Prescriptions */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <MedicationIcon color="primary" sx={{ mr: 1 }} />
                Recent Prescriptions
              </Typography>
              <Button size="small" color="primary">View All</Button>
            </Box>
            {patientInfo.recentPrescriptions.length > 0 ? (
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                {patientInfo.recentPrescriptions.map((prescription) => (
                  <Card key={prescription.id} sx={{ minWidth: 250 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Prescription #{prescription.id}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {new Date(prescription.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Doctor: <strong>{prescription.doctor}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Status: <span style={{ 
                          color: prescription.status === 'Active' ? 'green' : 'inherit',
                          fontWeight: 'bold'
                        }}>
                          {prescription.status}
                        </span>
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">No recent prescriptions</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientLanding;
