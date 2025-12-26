import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

// Import healthcare components
import Navigation from '../common/Navigation';
import ProtectedRoute from '../common/ProtectedRoute';

// Auth components
import Welcome from '../auth/Welcome';
import Login from '../auth/Login';
import MailVerification from '../auth/MailVerification';
import ProfileSetup from '../auth/ProfileSetup';
import PasswordSetup from '../auth/PasswordSetup';

// Patient components
import PatientDashboard from '../patient/PatientDashboard';
import PatientProfileSetup from '../patient/PatientProfileSetup';
import PatientAppointments from '../patient/PatientAppointments';
import PatientPrescriptions from '../patient/PatientPrescriptions';
import PatientHealthRecords from '../patient/PatientHealthRecords';
import PatientMessages from '../patient/PatientMessages';
import PatientProfile from '../patient/PatientProfile';
import PatientHospitals from '../patient/PatientHospitals';
import PatientMedicine from '../patient/PatientMedicine';
import PatientBookAppointment from '../patient/PatientBookAppointment';
import PatientDoctors from '../patient/PatientDoctors';

// Doctor components
import DoctorDashboard from '../doctor/DoctorDashboard';
import DoctorInfoSetup from '../doctor/DoctorInfoSetup';
import DoctorAppointments from '../doctor/DoctorAppointments';
import DoctorPatients from '../doctor/DoctorPatients';
import DoctorPrescriptions from '../doctor/DoctorPrescriptions';
import DoctorMessages from '../doctor/DoctorMessages';
import DoctorProfile from '../doctor/DoctorProfile';

// Layout component that includes the navigation
const Layout = ({ userType }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation userType={userType} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

// Public routes that don't require authentication
const PublicRoutes = () => (
  <Routes>
    <Route index element={<Welcome />} />
    <Route path="login" element={<Login />} />
    <Route path="verify-email" element={<MailVerification />} />
    <Route path="*" element={<Navigate to="/auth" replace />} />
  </Routes>
);

// Protected routes for authenticated users
const AppRoutes = () => (
  <Routes>
    {/* Patient Routes */}
    <Route path="/patient" element={
      <ProtectedRoute requireProfileComplete={false}>
        <Layout userType="patient" />
      </ProtectedRoute>
    }>
      <Route path="dashboard" element={<PatientDashboard />} />
      <Route path="appointments" element={<PatientAppointments />} />
      <Route path="prescriptions" element={<PatientPrescriptions />} />
      <Route path="health-records" element={<PatientHealthRecords />} />
      <Route path="hospitals" element={<PatientHospitals />} />
      <Route path="medicine" element={<PatientMedicine />} />
      <Route path="book-appointment" element={<PatientBookAppointment />} />
      <Route path="doctors" element={<PatientDoctors />} />
      <Route path="messages" element={<PatientMessages />} />
      <Route path="profile" element={<PatientProfile />} />
      <Route path="profile-setup" element={<ProfileSetup userType="patient" />} />
      <Route path="profile/complete" element={
        <ProtectedRoute requireProfileComplete={false}>
          <PatientProfileSetup />
        </ProtectedRoute>
      } />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>

    {/* Doctor Routes */}
    <Route path="/doctor" element={
      <ProtectedRoute requireProfileComplete={false}>
        <Layout userType="doctor" />
      </ProtectedRoute>
    }>
      <Route path="dashboard" element={<DoctorDashboard />} />
      <Route path="appointments" element={<DoctorAppointments />} />
      <Route path="patients" element={<DoctorPatients />} />
      <Route path="prescriptions" element={<DoctorPrescriptions />} />
      <Route path="messages" element={<DoctorMessages />} />
      <Route path="profile" element={<DoctorProfile />} />
      <Route path="profile-setup" element={
        <ProtectedRoute requireProfileComplete={false}>
          <DoctorInfoSetup />
        </ProtectedRoute>
      } />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>

    {/* Redirect root to appropriate dashboard based on user type */}
    <Route path="/" element={
      <ProtectedRoute>
        {({ user }) => (
          <Navigate to={`/${user.userType}/dashboard`} replace />
        )}
      </ProtectedRoute>
    } />

    {/* Catch all other routes */}
    <Route path="*" element={
      <ProtectedRoute>
        {({ user }) => (
          <Navigate to={`/${user?.userType || 'patient'}/dashboard`} replace />
        )}
      </ProtectedRoute>
    } />
  </Routes>
);

// Main healthcare routes component
export const HealthcareRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<PublicRoutes />} />
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
};

export default HealthcareRoutes;
