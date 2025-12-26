import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, AppBar, Toolbar, Typography, Button, Container, 
  IconButton, Menu, MenuItem, Avatar, CircularProgress, Snackbar, Alert,
  ListItemIcon
} from '@mui/material';
import {
  LocalHospital as LocalHospitalIcon,
  AccountCircle,
  ExitToApp,
  Person,
  Home as HomeIcon
} from '@mui/icons-material';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HospitalProvider } from './contexts/HospitalContext';

// Views
import HomeView from './views/HomeView';
import UnauthorizedView from './views/UnauthorizedView';
import AboutView from './views/AboutView';
import RoleSelectView from './views/RoleSelectView';
import PatientDashboardView from './views/patient/PatientDashboardView';
import DoctorDashboardView from './views/doctor/DoctorDashboardView';
import LoginView from './views/auth/LoginView';
import RegisterView from './views/auth/RegisterView';
import DoctorRegisterView from './views/auth/DoctorRegisterView';
import HospitalListView from './views/HospitalListView';
import DoctorListView from './views/DoctorListView';
import AppointmentView from './views/AppointmentView';
import ProfileView from './views/ProfileView';
import MedicineSearch from './components/medicine/MedicineSearch';
import ProtectedRoute from './components/common/ProtectedRoute';

// Create a refined, professional theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0ea5e9' }, // sky-500
    secondary: { main: '#6366f1' }, // indigo-500
    background: { default: '#f7fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `:root { color-scheme: light; }`,
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'saturate(180%) blur(8px)',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        rounded: { borderRadius: 12 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 220ms ease, box-shadow 220ms ease',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10 },
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            background: 'linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)',
          },
        },
      ],
    },
    MuiTableContainer: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

// Navigation bar component
const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleClose();
    logout();
  };

  // Don't show navbar on login/register pages
  if ([`/login/${user?.role}` , '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <AppBar position="static" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LocalHospitalIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            MediCare Network
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/" color="inherit">
              Home
            </Button>
            <Button component={Link} to="/hospitals" color="inherit">
              Our Hospitals
            </Button>
            <Button component={Link} to="/medicines" color="inherit">
              Find Medicines
            </Button>
            {isAuthenticated && user?.role === 'patient' && (
              <Button component={Link} to="/appointments" color="inherit">
                My Appointments
              </Button>
            )}
            {isAuthenticated && user?.role === 'doctor' && (
              <>
                <Button component={Link} to="/doctor/dashboard" color="inherit">
                  Dashboard
                </Button>
                <Button component={Link} to="/doctor/dashboard?tab=1" color="inherit">
                  Appointments
                </Button>
              </>
            )}
          </Box>

          {isAuthenticated ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ ml: 2 }}
              >
                <Avatar 
                  alt={user?.name} 
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.name?.charAt(0) || <AccountCircle />}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
              <Button 
                component={Link} 
                to="/login" 
                variant="outlined" 
                color="inherit"
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register" 
                variant="contained" 
                color="secondary"
                disableElevation
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

// Main layout with navigation
const MainLayout = ({ children }) => {
  const { loading } = useAuth();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
      <Box component="footer" sx={{ py: 3, backgroundColor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            {new Date().getFullYear()} MediCare Network. All rights reserved.
          </Typography>
        </Container>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Define public routes that don't require authentication
const publicRoutes = [
  // TEMP: bypass doctor login and go straight to dashboard
  { path: '/login/doctor', element: <Navigate to="/doctor/dashboard" replace /> },
  { path: '/login/:role', element: <LoginView /> },
  { path: '/register', element: <RegisterView /> },
  { path: '/register/doctor', element: <DoctorRegisterView /> },
  { path: '/unauthorized', element: <UnauthorizedView /> },
  { path: '/login', element: <Navigate to="/role-select" /> },
];

// Define protected routes with their required roles
const protectedRoutes = [
  // Public routes that use MainLayout but don't require auth
  { path: '/', element: <HomeView />, layout: true },
  { path: '/about', element: <AboutView />, layout: true },
  { path: '/hospitals', element: <HospitalListView />, layout: true },
  { path: '/doctors', element: <DoctorListView />, layout: true },
  
  // Protected routes
  { 
    path: '/patient/dashboard', 
    element: <PatientDashboardView />, 
    roles: ['patient'],
    layout: true 
  },
  { 
    path: '/appointments', 
    element: <AppointmentView />, 
    roles: ['patient'],
    layout: true 
  },
  { 
    path: '/book-appointment', 
    element: <AppointmentView />, 
    roles: ['patient'],
    layout: true 
  },
  // TEMP: make doctor dashboard public (no auth required)
  { 
    path: '/doctor/dashboard', 
    element: <DoctorDashboardView />, 
    layout: true 
  },
  { 
    path: '/profile', 
    element: <ProfileView />, 
    auth: true,
    layout: true 
  },
  { 
    path: '/medicines', 
    element: <MedicineSearch />, 
    auth: true,
    layout: true 
  },
  { 
    path: '/role-select', 
    element: <RoleSelectView />, 
    layout: true 
  },
  // Legacy deep links to patient history should redirect to the dashboard with the history tab
  {
    path: '/patients/:id/history',
    element: <Navigate to="/patient/dashboard?tab=history" replace />, 
    roles: ['patient'],
    layout: true
  },
  // Legacy/alias redirect
  { 
    path: '/doctor', 
    element: <Navigate to="/doctors" replace />, 
    layout: true 
  },
];

// Create route elements with proper protection
const createRouteElement = (route) => {
  let element = route.element;
  
  // Wrap with ProtectedRoute if auth is required or roles are specified
  if (route.auth || (route.roles && route.roles.length > 0)) {
    element = (
      <ProtectedRoute roles={route.roles}>
        {route.element}
      </ProtectedRoute>
    );
  }
  
  // Wrap with layout if specified
  if (route.layout) {
    element = <MainLayout>{element}</MainLayout>;
  }
  
  return element;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HospitalProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Public routes */}
              {publicRoutes.map((route) => (
                <Route 
                  key={route.path} 
                  path={route.path} 
                  element={route.element} 
                />
              ))}

              {/* Protected and layout routes */}
              {protectedRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={createRouteElement(route)}
                />
              ))}

              {/* 404 - Keep this as the last route */}
              <Route 
                path="*" 
                element={
                  <MainLayout>
                    <Box textAlign="center" py={10}>
                      <Typography variant="h4" gutterBottom>
                        Page Not Found
                      </Typography>
                      <Button variant="contained" component={Link} to="/">
                        Go to Home
                      </Button>
                    </Box>
                  </MainLayout>
                } 
              />
            </Routes>
          </Router>
        </AuthProvider>
      </HospitalProvider>
    </ThemeProvider>
  );
}

export default App;
