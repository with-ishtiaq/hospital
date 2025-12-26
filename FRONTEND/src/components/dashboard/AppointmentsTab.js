import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider,
  Chip,
  IconButton,
  Grid
} from '@mui/material';
import { 
  CalendarToday, 
  AccessTime, 
  Person as PersonIcon, 
  LocationOn as LocationIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.8,
      image: '/path/to/doctor1.jpg'
    },
    date: '2023-06-15',
    time: '10:30 AM',
    status: 'confirmed',
    location: 'Downtown Medical Center, Room 302',
    notes: 'Annual heart checkup'
  },
  {
    id: 2,
    doctor: {
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      rating: 4.9,
      image: '/path/to/doctor2.jpg'
    },
    date: '2023-06-20',
    time: '2:15 PM',
    status: 'pending',
    location: 'City General Hospital, Wing B',
    notes: 'Follow-up appointment'
  }
];

const AppointmentsTab = () => {
  const navigate = useNavigate();
  const [appointments] = useState(mockAppointments);
  
  const handleViewAllAppointments = () => {
    // In a real app, this would navigate to a full appointments page
    console.log('Viewing all appointments');
    alert('This would navigate to a full appointments page in a real application.');
  };
  
  const handleBookNewAppointment = () => {
    // In a real app, this would navigate to the doctor search or booking page
    console.log('Booking new appointment');
    alert('This would open the doctor search/booking page in a real application.');
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarToday color="primary" /> Upcoming Appointments
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleBookNewAppointment}
          sx={{ textTransform: 'none' }}
        >
          Book New Appointment
        </Button>
      </Box>
      
      <Card>
        {appointments.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {appointments.map((appointment, index) => (
              <React.Fragment key={appointment.id}>
                <ListItem 
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton edge="end" aria-label="more">
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar alt={appointment.doctor.name} src={appointment.doctor.image}>
                      {appointment.doctor.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" component="span">
                          {appointment.doctor.name}
                        </Typography>
                        <Chip 
                          label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          size="small"
                          color={getStatusColor(appointment.status)}
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          display="block"
                          mb={0.5}
                        >
                          {appointment.doctor.specialty}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {appointment.time}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {appointment.location}
                          </Typography>
                        </Box>
                        {appointment.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Note: {appointment.notes}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < appointments.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ 
            p: 3, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px'
          }}>
            <CalendarToday sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No upcoming appointments
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '400px' }}>
              You don't have any scheduled appointments. Book an appointment with a doctor to get started.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleBookNewAppointment}
              startIcon={<AccessTime />}
              sx={{ textTransform: 'none' }}
            >
              Book an Appointment
            </Button>
          </Box>
        )}
      </Card>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<AccessTime />}
          onClick={handleViewAllAppointments}
          sx={{ 
            textTransform: 'none',
            px: 4,
            py: 1.5
          }}
        >
          View All Appointments
        </Button>
      </Box>
    </Box>
  );
};

export default AppointmentsTab;
