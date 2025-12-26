import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import {
  Person as PersonIcon,
  Event as EventIcon,
  MedicalServices as MedicalServicesIcon,
  LocalPharmacy as PrescriptionIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  FileUpload as FileUploadIcon,
  History as HistoryIcon,
  Dashboard as DashboardIcon,
  LocalHospital as LocalHospitalIcon,
  MedicalInformation as MedicalInformationIcon,
  FitnessCenter as FitnessCenterIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Contexts & API
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI } from '../../services/api';
import MedicalInfoForm from '../../components/patient/MedicalInfoForm';
import PrescriptionUpload from '../../components/patient/PrescriptionUpload';
import ChatbotWidget from '../../components/common/ChatbotWidget';

const PatientDashboardView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const medicalInfoRef = useRef(null);

  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (!tab) return 0;
    switch (tab.toLowerCase()) {
      case 'history':
      case 'medical-history':
        return 2; // Medical History tab index
      case 'appointments':
        return 1;
      case 'medical-info':
      case 'info':
        return 3;
      case 'prescriptions':
        return 4;
      default:
        return 0;
    }
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Update tab when query param changes (e.g., redirects)
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.search]);

  const [patient, setPatient] = useState({
    patientName: '',
    email: '',
    phone: '',
    bloodType: '',
    height: { value: '', unit: 'cm' },
    weight: { value: '', unit: 'kg' },
    bmi: '',
    allergies: [],
    conditions: [],
    medications: [],
    appointments: []
  });
  
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Defensive role guard: ensure only patients render this view
  if (user && user.role && user.role !== 'patient') {
    const destination = user.role === 'doctor' ? '/doctor/dashboard' : '/role-select';
    return <Navigate to={destination} replace />;
  }

  const fetchPatientData = useCallback(async () => {
    try {
      setLoading(true);
      const targetId = id || user?.id;
      if (!targetId) return;

      const [profileRes, prescriptionsRes] = await Promise.all([
        patientAPI.getProfile(targetId),
        patientAPI.getPrescriptions(targetId)
      ]);

      const profile = profileRes?.data?.data || profileRes?.data || {};
      const rx = prescriptionsRes?.data?.data || prescriptionsRes?.data || [];

      setPatient(prev => ({
        ...prev,
        ...profile,
        allergies: profile.allergies || [],
        conditions: profile.conditions || [],
        medications: profile.medications || [],
        appointments: profile.appointments || []
      }));

      setPrescriptions(Array.isArray(rx) ? rx : []);
      
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Failed to load patient data. Please try again later.');
      showSnackbar('Failed to load patient data', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const handlePrescriptionUpload = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('prescriptionFile', file);
      const targetId = id || user?.id;
      
      await patientAPI.uploadPrescription(targetId, formData);
      
      const response = await patientAPI.getPrescriptions(targetId);
      const rx = response?.data?.data || response?.data || [];
      setPrescriptions(Array.isArray(rx) ? rx : []);
      showSnackbar('Prescription uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading prescription:', error);
      showSnackbar(error.response?.data?.message || 'Failed to upload prescription', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMedicalInfo = async (medicalInfo) => {
    try {
      setLoading(true);
      const targetId = id || user?.id;
      await patientAPI.updateMedicalInfo(targetId, medicalInfo);
      
      const response = await patientAPI.getProfile(targetId);
      setPatient(response.data);
      showSnackbar('Medical information updated successfully', 'success');
    } catch (error) {
      console.error('Error updating medical info:', error);
      showSnackbar(error.response?.data?.message || 'Failed to update medical information', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (type, itemId) => navigate(`/${type}/${itemId}`);
  const handleEditProfile = () => navigate(`/patients/${id || user?.id}/edit`);

  const scrollToMedicalInfo = () => {
    if (medicalInfoRef.current) {
      medicalInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading && !patient.patientName) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const calculateBMI = () => {
    if (!patient.height?.value || !patient.weight?.value) return null;
    const heightInMeters = patient.height.unit === 'cm' ? patient.height.value / 100 : patient.height.value * 0.0254;
    const weightInKg = patient.weight.unit === 'kg' ? patient.weight.value : patient.weight.value * 0.453592;
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi
    ? bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy weight' : bmi < 30 ? 'Overweight' : 'Obesity'
    : '';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const upcomingAppointments = patient.appointments
    ?.filter(apt => new Date(apt.date) > new Date())
    ?.sort((a, b) => new Date(a.date) - new Date(b.date))
    ?.slice(0, 3) || [];

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 4 }} className="fade-in">
        <Grid container spacing={3}>
          {/* Profile Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, height: '100%', transition: 'box-shadow 200ms ease', '&:hover': { boxShadow: 6 } }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  sx={{ width: 120, height: 120, fontSize: '3rem', border: '3px solid', borderColor: 'primary.main', bgcolor: 'primary.light', color: 'primary.contrastText' }}
                  src={patient.profileImage}
                  alt={patient.patientName || 'Patient'}
                >
                  {patient.patientName?.charAt(0) || 'P'}
                </Avatar>
                <IconButton size="small" onClick={handleEditProfile} sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
                {patient.patientName || 'Patient Name'}
              </Typography>
              <Box sx={{ width: '100%', mt: 1, mb: 2 }}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><LocalHospitalIcon color="primary" sx={{ mr: 1, fontSize: 20 }} /><Typography variant="body2" color="text.secondary">{patient.bloodType ? `Blood Type: ${patient.bloodType}` : 'Blood Type not specified'}</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><PersonIcon color="primary" sx={{ mr: 1, fontSize: 20 }} /><Typography variant="body2" color="text.secondary">{patient.gender || 'Gender not specified'}</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><EventIcon color="primary" sx={{ mr: 1, fontSize: 20 }} /><Typography variant="body2" color="text.secondary">{patient.dob ? `DOB: ${new Date(patient.dob).toLocaleDateString()}` : 'DOB not specified'}</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><MedicalInformationIcon color="primary" sx={{ mr: 1, fontSize: 20 }} /><Typography variant="body2" color="text.secondary">{patient.height?.value ? `Height: ${patient.height.value} ${patient.height.unit}` : 'Height not specified'}</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><FitnessCenterIcon color="primary" sx={{ mr: 1, fontSize: 20 }} /><Typography variant="body2" color="text.secondary">{patient.weight?.value ? `Weight: ${patient.weight.value} ${patient.weight.unit}` : 'Weight not specified'}</Typography></Box>
                {bmi && (
                  <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 1, mt: 2, borderLeft: '4px solid', borderColor: bmi < 18.5 ? 'warning.main' : bmi < 25 ? 'success.main' : bmi < 30 ? 'warning.main' : 'error.main' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>BMI: {bmi} - {bmiCategory}</Typography>
                    <Typography variant="caption" color="text.secondary">{bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy weight' : bmi < 30 ? 'Overweight' : 'Obesity'}</Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ width: '100%', mt: 'auto', pt: 2 }}>
                <PrescriptionUpload patientId={id || user?.id} onUploadSuccess={fetchPatientData} buttonProps={{ fullWidth: true, variant: 'outlined', startIcon: <FileUploadIcon /> }} />
              </Box>
            </Paper>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Button fullWidth variant="outlined" component="label" startIcon={<FileUploadIcon />} sx={{ mb: 1 }}>
                Upload Prescription
                <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handlePrescriptionUpload(e.target.files[0])} />
              </Button>
              <Button fullWidth variant="outlined" startIcon={<HistoryIcon />} onClick={() => navigate(`/patient/dashboard?tab=history`)}>View History</Button>
              <Button fullWidth variant="outlined" sx={{ mt: 1 }} startIcon={<MedicalInformationIcon />} onClick={scrollToMedicalInfo}>Fill Medical Info</Button>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Quick Stats" />
              <Tab label="Upcoming Appointments" />
              <Tab label="Medical History" />
              <Tab label="Medical Information" />
              <Tab label="Prescriptions" />
            </Tabs>

            {activeTab === 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><DashboardIcon color="primary" sx={{ mr: 1 }} />Quick Stats</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card variant="outlined" className="card-hover">
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', mr: 2 }}><EventIcon /></Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Upcoming Appointments</Typography>
                            <Typography variant="h6">{upcomingAppointments.length}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined" className="card-hover">
                      <CardHeader
                        avatar={<Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}><PrescriptionIcon /></Avatar>}
                        title="Recent Prescriptions"
                        subheader={prescriptions.length ? `${prescriptions.length} total` : 'No prescriptions yet'}
                        action={
                          <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/patient/dashboard?tab=prescriptions')}>
                            View
                          </Button>
                        }
                      />
                      <CardContent sx={{ pt: 0 }}>
                        {prescriptions.length ? (
                          <List dense disablePadding>
                            {prescriptions
                              .slice()
                              .sort((a, b) => new Date(b.date) - new Date(a.date))
                              .slice(0, 3)
                              .map((p) => (
                                <ListItem key={p._id} disableGutters sx={{ py: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}><MedicalServicesIcon fontSize="small" /></ListItemIcon>
                                  <ListItemText
                                    primary={p.doctorName ? `Dr. ${p.doctorName}` : 'Prescription'}
                                    secondary={p.date ? new Date(p.date).toLocaleDateString() : ''}
                                  />
                                </ListItem>
                              ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">Upload a prescription to see it here.</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {activeTab === 1 && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Upcoming Appointments</Typography>
                {upcomingAppointments.length > 0 ? (
                  <List>
                    {upcomingAppointments.map(apt => (
                      <ListItem key={apt.id}>
                        <ListItemText primary={`Dr. ${apt.doctor} - ${apt.specialty}`} secondary={formatDate(apt.date)} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">No upcoming appointments</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/appointments/new')}>Book an Appointment</Button>
                  </Box>
                )}
              </Paper>
            )}

            {activeTab === 2 && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Medical History</Typography>
                {/* Implement medical history display here */}
                <Typography>Medical history section is under construction.</Typography>
              </Paper>
            )}

            {activeTab === 3 && (
              <Paper ref={medicalInfoRef} sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6" gutterBottom>Update Your Medical Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <MedicalInfoForm patient={patient} onSave={handleSaveMedicalInfo} />
              </Paper>
            )}

            {activeTab === 4 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>Prescriptions</Typography>
                {prescriptions.length > 0 ? (
                  <List>
                    {prescriptions.map((prescription) => (
                      <Card key={prescription._id} sx={{ mb: 2 }} className="card-hover">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="subtitle1">{new Date(prescription.date).toLocaleDateString()}</Typography><Typography color="text.secondary">Dr. {prescription.doctorName}</Typography></Box>
                          {prescription.diagnosis && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}><strong>Diagnosis:</strong> {prescription.diagnosis}</Typography>}
                          {prescription.notes && <Typography variant="body2" sx={{ mt: 1 }}>{prescription.notes}</Typography>}
                          {prescription.medications?.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2">Medications:</Typography>
                              <List dense>
                                {prescription.medications.map((med, idx) => (
                                  <ListItem key={idx}>
                                    <ListItemIcon><MedicalServicesIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText primary={`${med.name} - ${med.dosage}`} secondary={`${med.frequency} • ${med.duration}`} />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                          {prescription.files?.map((file, idx) => (
                            <Button key={idx} size="small" onClick={() => window.open(`/uploads/${file.filePath}`, '_blank')}>View File {idx + 1}</Button>
                          ))}
                          <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                        </CardActions>
                      </Card>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <FileUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">No prescriptions found</Typography>
                    <Button variant="outlined" sx={{ mt: 2 }} component="label" startIcon={<FileUploadIcon />}>
                      Upload Your First Prescription
                      <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handlePrescriptionUpload(e.target.files[0])} />
                    </Button>
                  </Box>
                )}
              </Paper>
            )}
          </Grid>
        </Grid>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
      <ChatbotWidget role="patient" />
    </>
  );
};

export default PatientDashboardView;
