import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Link, 
    Paper, 
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Email, Lock } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RegisterView = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dateOfBirth: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/;
        
        if (!formData.patientName.trim()) {
            newErrors.patientName = 'Full name is required';
        }
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                setIsSubmitting(true);
                
                // Prepare registration data
                const registrationData = {
                    patientName: formData.patientName,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    dateOfBirth: formData.dateOfBirth
                };
                
                // Call the register function from AuthContext
                await register(registrationData);
                
                // Redirect to home page after successful registration
                navigate('/');
            } catch (error) {
                console.error('Registration error:', error);
                setErrors(prev => ({
                    ...prev,
                    form: error.message || 'Registration failed. Please try again.'
                }));
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                p: 2,
                backgroundColor: (theme) => theme.palette.background.default
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 2
                }}
            >
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Create an Account
                </Typography>
                
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                    Join our platform to access all features
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="patientName"
                        label="Full Name"
                        name="patientName"
                        autoComplete="name"
                        autoFocus
                        value={formData.patientName}
                        onChange={handleChange}
                        error={!!errors.patientName}
                        helperText={errors.patientName}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        id="phone"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone || 'e.g., 1234567890'}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                        id="dateOfBirth"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password || 'At least 6 characters'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    {errors.form && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {errors.form}
                        </Typography>
                    )}
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isSubmitting}
                        sx={{ mt: 2, mb: 2, py: 1.5 }}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" variant="body2">
                                Sign In
                            </Link>
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Are you a doctor?{' '}
                            <Link component={RouterLink} to="/register/doctor" variant="body2">
                                Register here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default RegisterView;