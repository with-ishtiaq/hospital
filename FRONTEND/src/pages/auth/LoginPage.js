import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import '../../styles/auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient', // 'patient' or 'doctor'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || `/${formData.role}/dashboard`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginFunction = formData.role === 'patient' 
        ? authAPI.loginPatient 
        : authAPI.loginDoctor;
      
      const response = await loginFunction({
        email: formData.email,
        password: formData.password,
      });
      
      // Call the login function from AuthContext
      await login(response.data.token, response.data.user);
      
      // Redirect to the intended page or role-specific dashboard
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>I am a:</label>
          <div className="role-selector">
            <button 
              type="button"
              className={`role-btn ${formData.role === 'patient' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, role: 'patient'})}
            >
              Patient
            </button>
            <button 
              type="button"
              className={`role-btn ${formData.role === 'doctor' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, role: 'doctor'})}
            >
              Doctor
            </button>
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

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="auth-links">
        <p>
          Don't have an account?{' '}
          <Link to="/register">Register as {formData.role}</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
