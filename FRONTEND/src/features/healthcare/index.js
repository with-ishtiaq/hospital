// Export all components for easier imports
export { default as Welcome } from './auth/Welcome';
export { default as Login } from './auth/Login';
export { default as MailVerification } from './auth/MailVerification';
export { default as ProfileSetup } from './auth/ProfileSetup';
export { default as PasswordSetup } from './auth/PasswordSetup';

export { default as PatientDashboard } from './patient/PatientDashboard';
export { default as PatientProfileSetup } from './patient/PatientProfileSetup';

export { default as DoctorDashboard } from './doctor/DoctorDashboard';
export { default as DoctorInfoSetup } from './doctor/DoctorInfoSetup';

export { default as Navigation } from './common/Navigation';
export { default as ProtectedRoute } from './common/ProtectedRoute';

export { AuthProvider, useAuth } from './context/AuthContext';

export { HealthcareRoutes } from './routes/HealthcareRoutes';
