import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Link, 
    Paper, 
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Email, Lock, MedicalServices, Badge } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

const DoctorRegisterView = () => {
    const [formData, setFormData] = useState({
        doctorName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        department: '',
        specialization: '',
        employeeId: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth(); // Using login to set user after registration
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.doctorName.trim()) newErrors.doctorName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                setIsSubmitting(true);
                
                const registrationData = {
                    doctorName: formData.doctorName,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    department: formData.department,
                    specialization: formData.specialization,
                    employeeId: formData.employeeId
                };
                
                await authAPI.registerDoctor(registrationData);
                
                // Log in the new doctor to get a token and set user context
                await login(formData.email, formData.password, 'doctor');
                
                navigate('/doctor/dashboard');
            } catch (error) {
                console.error('Doctor registration error:', error);
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Doctor Registration
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField margin="normal" required fullWidth id="doctorName" label="Full Name" name="doctorName" value={formData.doctorName} onChange={handleChange} error={!!errors.doctorName} helperText={errors.doctorName} />
                    <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
                    <TextField margin="normal" required fullWidth id="phoneNumber" label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} error={!!errors.phoneNumber} helperText={errors.phoneNumber} />
                    <TextField margin="normal" required fullWidth id="department" label="Department" name="department" value={formData.department} onChange={handleChange} error={!!errors.department} helperText={errors.department} />
                    <TextField margin="normal" required fullWidth id="specialization" label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} error={!!errors.specialization} helperText={errors.specialization} />
                    <TextField margin="normal" required fullWidth id="employeeId" label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} error={!!errors.employeeId} helperText={errors.employeeId} />
                    <TextField margin="normal" required fullWidth name="password" label="Password" type={showPassword ? 'text' : 'password'} id="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} InputProps={{endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>)}} />
                    <TextField margin="normal" required fullWidth name="confirmPassword" label="Confirm Password" type={showPassword ? 'text' : 'password'} id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} />
                    {errors.form && <Typography color="error">{errors.form}</Typography>}
                    <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting} sx={{ mt: 2 }}>
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </Button>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login/doctor" variant="body2">
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default DoctorRegisterView;
