import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    CircularProgress, 
    Card, 
    CardContent, 
    CardMedia, 
    Chip,
    Grid
} from '@mui/material';
import { 
    EventAvailable as EventAvailableIcon,
    LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { useHospital } from '../contexts/HospitalContext';

const DoctorAppointmentView = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { hospitals } = useHospital();
    
    // Set loading to false once hospitals are loaded
    useEffect(() => {
        if (hospitals.length > 0) {
            setLoading(false);
        }
    }, [hospitals]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error" gutterBottom>{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>Book an Appointment</Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Select a hospital to book your appointment
            </Typography>
            
            <Grid container spacing={3}>
                {hospitals.map((hospital) => (
                    <Grid item xs={12} sm={6} md={4} key={hospital._id}>
                        <Card 
                            elevation={2} 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-4px)',
                                    transition: 'all 0.3s ease-in-out'
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="160"
                                image={hospital.imageUrl || '/default-hospital.jpg'}
                                alt={hospital.name}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                    <HospitalIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                                        {hospital.name}
                                    </Typography>
                                </Box>
                                
                                {hospital.specialties && hospital.specialties.length > 0 && (
                                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {hospital.specialties.slice(0, 3).map((specialty, index) => (
                                            <Chip 
                                                key={index} 
                                                label={specialty} 
                                                size="small" 
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                )}
                                
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {hospital.address}
                                </Typography>
                                
                                <Box sx={{ mt: 'auto', pt: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        href={hospital.appointmentUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        disabled={!hospital.appointmentUrl}
                                        startIcon={<EventAvailableIcon />}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            '&:hover': {
                                                boxShadow: 2
                                            }
                                        }}
                                    >
                                        Book Appointment Online
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DoctorAppointmentView;
