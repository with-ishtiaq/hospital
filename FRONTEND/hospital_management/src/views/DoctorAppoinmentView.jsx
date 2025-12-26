import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    CircularProgress, 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    Chip
} from '@mui/material';
import { 
    EventAvailable as EventAvailableIcon,
    LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { useHospital } from '../contexts/HospitalContext';

const DoctorAppointmentView = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { hospitals, selectedHospital } = useHospital();
    
    // Set loading to false once hospitals are loaded
    useEffect(() => {
        if (hospitals.length > 0) {
            setLoading(false);
        }
    }, [hospitals]);

    const fetchPatientsByDoctor = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/appointments/doctor/${currentDoctorId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch patients');
            }

            const data = await response.json();
            setPatients(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setError('Failed to load patient records');
        } finally {
            setLoading(false);
        }
    };

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
                            {activeFeedbackId === patient._id && (
                                <div className="feedback-form">
                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder="Write your feedback here..."
                                        rows={4}
                                    />
                                    <button className="submit-feedback-btn" onClick={() => submitFeedback(patient._id)}>
                                        Submit
                                    </button>
                                    {submitStatus && <p className="status-msg">{submitStatus}</p>}
                                </div>
                            )}


                        </div>
                    ))
                )}
            </div>
        </div>
        </Box>
    );
};

export default DoctorAppointmentView;
