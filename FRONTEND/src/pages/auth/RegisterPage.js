import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import '../../styles/auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient', // 'patient' or 'doctor'
    // Additional fields for doctor registration
    specialization: '',
    licenseNumber: '',
    hospital: '',
    experience: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || `/${formData.role}/dashboard`;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Additional validation for doctor registration
    if (formData.role === 'doctor') {
      if (!formData.specialization || !formData.licenseNumber) {
        setError('Specialization and license number are required for doctors');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form inputs
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Determine the appropriate registration function based on role
      const registerFunction = formData.role === 'patient' 
        ? authAPI.registerPatient 
        : authAPI.registerDoctor;
      
      // Prepare registration data according to API expectations
      const registrationData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        // Include additional fields for doctors
        ...(formData.role === 'doctor' && {
          specialization: formData.specialization.trim(),
          license_number: formData.licenseNumber.trim(),
          hospital: formData.hospital.trim(),
          experience: parseInt(formData.experience) || 0
        })
      };
      
      // Make the API call
      const response = await registerFunction(registrationData);
      
      if (response.data && response.data.token) {
        // Auto-login after successful registration
        await login(response.data.token, response.data.user);
        
        // Redirect to the intended page or role-specific dashboard
        navigate(from, { replace: true });
      } else {
        throw new Error('Registration successful but no token received');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register as {formData.role}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>I am a:</label>
          <div className="role-selector">
            <button 
              type="button"
              className={`role-btn ${formData.role === 'patient' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({...prev, role: 'patient'}))}
            >
              Patient
            </button>
            <button 
              type="button"
              className={`role-btn ${formData.role === 'doctor' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({...prev, role: 'doctor'}))}
            >
              Doctor
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
        </div>

        {/* Additional fields for doctor registration */}
        {formData.role === 'doctor' && (
          <>
            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  min="0"
                  value={formData.experience || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Hospital/Clinic</label>
              <input
                type="text"
                name="hospital"
                value={formData.hospital || ''}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="auth-links">
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
