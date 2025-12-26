import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, Button,
  Grid, Card, CardContent, Avatar, Divider, List, ListItem,
  ListItemText, ListItemIcon, Chip, Badge, IconButton, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  InputAdornment
} from '@mui/material';
import {
  Person, Event, People, Schedule, Today, AccessTime, Add,
  Edit, Delete, CheckCircle, Cancel, Search, FilterList, Star,
  MedicalServices, Medication, History, Note, Close, ArrowForward
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI } from '../../services/api';
import { format } from 'date-fns';
import ChatbotWidget from '../../components/common/ChatbotWidget';

const DoctorDashboardView = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Resolve doctorId: prefer route param :id, then query ?id=, then logged-in user id
  const doctorId = (() => {
    if (id) return id;
    const qs = new URLSearchParams(location.search);
    const qid = qs.get('id');
    return qid || user?._id || user?.id;
  })();
  const [activeTab, setActiveTab] = useState(0);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [emergencies, setEmergencies] = useState([]);
  const [emergencyFilter, setEmergencyFilter] = useState('open');
  const [operationSchedule, setOperationSchedule] = useState([]);

  // Demo data used when developing without auth token but with an :id in the route
  const getDemoData = useCallback(() => ({
    doctor: {
      _id: id || 'demo-doctor-id',
      name: 'Dr. Demo Developer',
      specialization: 'Internal Medicine',
      hospital: { name: 'MediCare General Hospital' },
      experienceYears: 10,
    },
    appointments: [
      { _id: 'a1', date: new Date().toISOString(), patientName: 'John Doe', status: 'confirmed' },
      { _id: 'a2', date: new Date(Date.now() + 86400000).toISOString(), patientName: 'Jane Smith', status: 'pending' },
    ],
    patients: [
      { _id: 'p1', name: 'John Doe', age: 42, gender: 'Male', bloodType: 'O+' },
      { _id: 'p2', name: 'Jane Smith', age: 35, gender: 'Female', bloodType: 'A-' },
    ],
    emergencies: [
      { _id: 'e1', createdAt: new Date().toISOString(), patientId: { patientName: 'Alice M' }, summary: 'Severe chest pain', status: 'open' },
      { _id: 'e2', createdAt: new Date(Date.now() - 3600000).toISOString(), patientId: { patientName: 'Bob K' }, summary: 'Head injury', status: 'in_progress' },
    ],
    operationSchedule: [
      { _id: 'o1', time: new Date(Date.now() + 2*3600000).toISOString(), patientName: 'Mark R', procedure: 'Appendectomy', room: 'OR-2' },
      { _id: 'o2', time: new Date(Date.now() + 5*3600000).toISOString(), patientName: 'Sara T', procedure: 'Knee Arthroscopy', room: 'OR-1' },
    ],
  }), [id]);

  // If bypassing auth and there is no doctorId at all, hydrate with demo data
  useEffect(() => {
    if (!authLoading && !user && !doctorId) {
      const demo = getDemoData();
      setDoctor(demo.doctor);
      setAppointments(demo.appointments);
      setPatients(demo.patients);
      setEmergencies(demo.emergencies);
      setOperationSchedule(demo.operationSchedule);
      setPageLoading(false);
    }
  }, [authLoading, user, doctorId, getDemoData]);

  // Auth redirect disabled during dev bypass so the dashboard can render demo data

  // Defensive role guard: during bypass or when an explicit doctor id is provided, do NOT redirect
  const bypass = (typeof window !== 'undefined') && localStorage.getItem('bypassAuth') === 'true';
  if (!bypass && !(id || doctorId)) {
    if (user && user.role && user.role !== 'doctor') {
      const destination = user.role === 'patient' ? '/patient/dashboard' : '/role-select';
      return <Navigate to={destination} replace />;
    }
  }

  // Initialize tab from query string e.g., /doctor/dashboard?tab=1
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = parseInt(params.get('tab'), 10);
    if (!Number.isNaN(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Fetch doctor profile and appointments
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const [doctorRes, appointmentsRes] = await Promise.all([
          doctorAPI.getProfile(doctorId),
          doctorAPI.getAppointments(doctorId, { status: 'upcoming' })
        ]);
        
        setDoctor(doctorRes.data);
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.error('Doctor data load error:', err);
        // Dev fallback: if bypass flag is on OR API returned 401 on doctor route, show demo data
        const bypass = localStorage.getItem('bypassAuth') === 'true';
        const is401 = err?.response?.status === 401;
        if ((bypass || is401) && (id || doctorId)) {
          const demo = getDemoData();
          setDoctor(demo.doctor);
          setAppointments(demo.appointments);
          setEmergencies(demo.emergencies);
          setOperationSchedule(demo.operationSchedule);
        } else {
          setError('Failed to load doctor data');
        }
      } finally {
        setPageLoading(false);
      }
    };

    if (doctorId) fetchDoctorData();
  }, [doctorId]);

  // Fetch emergencies
  const fetchEmergencies = useCallback(async () => {
    try {
      const res = await doctorAPI.getEmergencies(doctorId, { status: emergencyFilter });
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : (Array.isArray(res?.data) ? res.data : []);
      setEmergencies(list);
    } catch (err) {
      console.error('Emergencies load error:', err);
      const bypass = localStorage.getItem('bypassAuth') === 'true';
      const is401 = err?.response?.status === 401;
      if (bypass || is401) {
        const demo = getDemoData();
        setEmergencies(demo.emergencies);
      } else {
        // keep UI but note error silently
      }
    }
  }, [doctorId, emergencyFilter, getDemoData]);

  useEffect(() => {
    if (doctorId) fetchEmergencies();
  }, [doctorId, emergencyFilter, fetchEmergencies]);

  const openEmergenciesCount = useMemo(() => {
    const list = Array.isArray(emergencies) ? emergencies : [];
    return list.filter(e => e.status === 'open').length;
  }, [emergencies]);

  

  // Fetch patients and their data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsRes = await doctorAPI.getPatients(doctorId);
        setPatients(patientsRes.data);
      } catch (err) {
        console.error('Patients load error:', err);
        const bypass = localStorage.getItem('bypassAuth') === 'true';
        const is401 = err?.response?.status === 401;
        if ((bypass || is401) && (id || doctorId)) {
          const demo = getDemoData();
          setPatients(demo.patients);
          setEmergencies(demo.emergencies);
          setOperationSchedule(demo.operationSchedule);
        } else {
          setError('Failed to load patients');
        }
      } finally {
        setPageLoading(false);
      }
    };

    if (doctorId) {
      fetchPatients();
    }
  }, [doctorId]);

  // Fetch medical history for selected patient
  const fetchPatientMedicalHistory = async (patientId) => {
    try {
      // This would be replaced with actual API call to get medical history
      // const historyRes = await doctorAPI.getPatientMedicalHistory(patientId);
      // setMedicalHistory(historyRes.data);
      
      // Mock data for now
      setMedicalHistory([
        { id: 1, date: '2023-01-15', diagnosis: 'Common Cold', notes: 'Prescribed rest and fluids' },
        { id: 2, date: '2023-02-20', diagnosis: 'Annual Checkup', notes: 'Patient in good health' },
      ]);
      
      // Mock prescriptions
      setPrescriptions([
        { id: 1, name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '5 days' },
        { id: 2, name: 'Vitamin C', dosage: '1000mg', frequency: 'Daily', duration: '30 days' },
      ]);
    } catch (err) {
      console.error('Error fetching medical history:', err);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    fetchPatientMedicalHistory(patient._id);
    setOpenPatientDialog(true);
  };

  if (pageLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!doctor) return <div>Doctor not found</div>;

  return (
    <>
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className="fade-in">
      <Grid container spacing={3}>
        {/* Profile Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', transition: 'box-shadow 200ms ease', '&:hover': { boxShadow: 3 } }}>
            <Avatar sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}>
              {doctor.name?.charAt(0) || 'D'}
            </Avatar>
            <Typography variant="h6">Dr. {doctor.name}</Typography>
            <Typography color="primary" gutterBottom>{doctor.specialization}</Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Star color="warning" />
              <Typography sx={{ ml: 0.5 }}>
                {doctor.rating?.toFixed(1) || 'N/A'}
              </Typography>
            </Box>

            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<Edit />}
              onClick={() => navigate(`/doctors/${id}/edit`)}
              sx={{ mb: 1 }}
            >
              Edit Profile
            </Button>
          </Paper>

          {/* Quick Stats */}
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Today's Schedule</Typography>
            {appointments.length > 0 ? (
              <List dense>
                {appointments.slice(0, 3).map((apt) => (
                  <ListItem key={apt._id}>
                    <ListItemIcon><AccessTime color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary={new Date(apt.date).toLocaleTimeString()}
                      secondary={apt.patientName}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No appointments today</Typography>
            )}
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
              <Tab label="Dashboard" />
              <Tab label={
                <Badge badgeContent={appointments.length} color="error">
                  Appointments
                </Badge>
              } />
              <Tab label={
                <Badge badgeContent={patients.length} color="primary">
                  Patients
                </Badge>
              } />
              <Tab label={<Badge badgeContent={openEmergenciesCount} color="error">Emergency Cases</Badge>} />
            </Tabs>

            <Divider />

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <div>
                  <Typography variant="h6" gutterBottom>
                    Welcome back, Dr. {doctor.name?.split(' ')[0]}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={4}>
                      <Card className="card-hover">
                        <CardContent>
                          <Typography color="text.secondary">Today's Appointments</Typography>
                          <Typography variant="h4">
                            {appointments.length}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card className="card-hover">
                        <CardContent>
                          <Typography color="text.secondary">Total Patients</Typography>
                          <Typography variant="h4">{patients.length}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card className="card-hover">
                        <CardContent>
                          <Typography color="text.secondary">Open Emergencies</Typography>
                          <Typography variant="h4">{openEmergenciesCount}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card className="card-hover">
                        <CardContent>
                          <Typography color="text.secondary">Surgeries Today</Typography>
                          <Typography variant="h4">{operationSchedule.length}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  {/* Operation schedule preview */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Today's Operation Schedule</Typography>
                    {operationSchedule.length > 0 ? (
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Time</TableCell>
                              <TableCell>Patient</TableCell>
                              <TableCell>Procedure</TableCell>
                              <TableCell>Room</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {operationSchedule.slice(0, 5).map(op => (
                              <TableRow key={op._id}>
                                <TableCell>{format(new Date(op.time), 'MMM d, yyyy h:mm a')}</TableCell>
                                <TableCell>{op.patientName}</TableCell>
                                <TableCell>{op.procedure}</TableCell>
                                <TableCell>{op.room}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography color="text.secondary">No operations scheduled for today</Typography>
                    )}
                  </Box>
                </div>
              )}

              {activeTab === 1 && (
                <div>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Upcoming Appointments</Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<Add />}
                      onClick={() => setActiveTab(1)}
                    >
                      New Appointment
                    </Button>
                  </Box>
                  
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date & Time</TableCell>
                          <TableCell>Patient</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {appointments.length > 0 ? (
                          appointments.map((appointment) => (
                            <TableRow key={appointment._id}>
                              <TableCell>
                                {format(new Date(appointment.date), 'MMM d, yyyy h:mm a')}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar sx={{ width: 32, height: 32 }}>
                                    {appointment.patientName?.charAt(0) || 'P'}
                                  </Avatar>
                                  {appointment.patientName}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={appointment.status} 
                                  color={
                                    appointment.status === 'confirmed' ? 'success' : 
                                    appointment.status === 'pending' ? 'warning' : 'default'
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="small" 
                                  endIcon={<ArrowForward />}
                                  onClick={() => navigate(`/appointments/${appointment._id}`)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              No upcoming appointments
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}

              {activeTab === 2 && (
                <div>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Patients</Typography>
                    <TextField
                      size="small"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Grid container spacing={2}>
                    {patients
                      .filter(patient => 
                        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(patient => (
                        <Grid item xs={12} sm={6} md={4} key={patient._id}>
                          <Card 
                            className="card-hover"
                            sx={{ 
                              cursor: 'pointer',
                              '&:hover': { boxShadow: 3 }
                            }}
                            onClick={() => handlePatientClick(patient)}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                                  {patient.name?.charAt(0) || 'P'}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1">
                                    {patient.name || 'Unnamed Patient'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {patient.email}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                                <Chip 
                                  icon={<Event fontSize="small" />} 
                                  label={`${patient.appointmentCount || 0} visits`} 
                                  size="small" 
                                  variant="outlined"
                                />
                                <Button size="small" endIcon={<ArrowForward />}>
                                  View
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </div>
              )}

              {activeTab === 3 && (
                <div>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Emergency Cases</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant={emergencyFilter==='open'?'contained':'outlined'} size="small" onClick={() => setEmergencyFilter('open')}>Open</Button>
                      <Button variant={emergencyFilter==='in_progress'?'contained':'outlined'} size="small" onClick={() => setEmergencyFilter('in_progress')}>In Progress</Button>
                      <Button variant={emergencyFilter==='resolved'?'contained':'outlined'} size="small" onClick={() => setEmergencyFilter('resolved')}>Resolved</Button>
                    </Box>
                  </Box>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Reported At</TableCell>
                          <TableCell>Patient</TableCell>
                          <TableCell>Summary</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {emergencies.length > 0 ? (
                          emergencies.map((c) => (
                            <TableRow key={c._id}>
                              <TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
                              <TableCell>{c.patientId?.patientName || 'Unknown'}</TableCell>
                              <TableCell>{c.summary}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={c.status.replace('_',' ')} 
                                  color={c.status==='resolved'?'success':c.status==='in_progress'?'warning':'error'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  {c.status === 'open' && (
                                    <Button size="small" onClick={async()=>{ await doctorAPI.assignEmergency(c._id); await fetchEmergencies(); }}>Assign to me</Button>
                                  )}
                                  {c.status !== 'resolved' && (
                                    <Button size="small" onClick={async()=>{ await doctorAPI.updateEmergencyStatus(c._id, 'in_progress'); await fetchEmergencies(); }}>Mark In-Progress</Button>
                                  )}
                                  {c.status !== 'resolved' && (
                                    <Button size="small" color="success" onClick={async()=>{ await doctorAPI.updateEmergencyStatus(c._id, 'resolved'); await fetchEmergencies(); }}>Resolve</Button>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} align="center">No emergency cases</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>

    {/* Patient Details Dialog */}
    <Dialog 
      open={openPatientDialog} 
      onClose={() => setOpenPatientDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Patient Details</span>
          <IconButton onClick={() => setOpenPatientDialog(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      {selectedPatient && (
        <>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box textAlign="center" mb={2}>
                  <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}>
                    {selectedPatient.name?.charAt(0) || 'P'}
                  </Avatar>
                  <Typography variant="h6">{selectedPatient.name}</Typography>
                  <Typography color="text.secondary">{selectedPatient.email}</Typography>
                  <Typography color="text.secondary">
                    {selectedPatient.phone || 'No phone number'}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    PERSONAL INFORMATION
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                      <ListItemText 
                        primary="Gender" 
                        secondary={selectedPatient.gender || 'Not specified'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Event fontSize="small" /></ListItemIcon>
                      <ListItemText 
                        primary="Date of Birth" 
                        secondary={selectedPatient.dob ? 
                          format(new Date(selectedPatient.dob), 'MMMM d, yyyy') : 'Not specified'
                        } 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><MedicalServices fontSize="small" /></ListItemIcon>
                      <ListItemText 
                        primary="Blood Type" 
                        secondary={selectedPatient.bloodType || 'Not specified'} 
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Tabs value={0}>
                  <Tab label="Medical History" />
                  <Tab label="Prescriptions" />
                  <Tab label="Lab Results" />
                </Tabs>
                <Divider />
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Medical History</Typography>
                  {medicalHistory.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Diagnosis</TableCell>
                            <TableCell>Notes</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {medicalHistory.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{format(new Date(record.date), 'MMM d, yyyy')}</TableCell>
                              <TableCell>{record.diagnosis}</TableCell>
                              <TableCell>{record.notes}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary">No medical history available</Typography>
                  )}
                  
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Current Prescriptions</Typography>
                  {prescriptions.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Medication</TableCell>
                            <TableCell>Dosage</TableCell>
                            <TableCell>Frequency</TableCell>
                            <TableCell>Duration</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {prescriptions.map((rx) => (
                            <TableRow key={rx.id}>
                              <TableCell>{rx.name}</TableCell>
                              <TableCell>{rx.dosage}</TableCell>
                              <TableCell>{rx.frequency}</TableCell>
                              <TableCell>{rx.duration}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary">No active prescriptions</Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button 
              variant="outlined" 
              onClick={() => setOpenPatientDialog(false)}
              sx={{ mr: 1 }}
            >
              Close
            </Button>
            <Button 
              variant="contained" 
              onClick={() => {
                setOpenPatientDialog(false);
                navigate(`/patients/${selectedPatient._id}`);
              }}
            >
              View Full Profile
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
    <ChatbotWidget role="doctor" />
    </>
  );
};

export default DoctorDashboardView;
