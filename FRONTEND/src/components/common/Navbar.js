import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!user) {
    return null; // Don't show navbar if user is not logged in
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          HealthCare
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-links">
              Dashboard
            </Link>
          </li>
          
          {user.role === 'doctor' && (
            <li className="nav-item">
              <Link to="/appointments" className="nav-links">
                Appointments
              </Link>
            </li>
          )}
          
          {user.role === 'patient' && (
            <li className="nav-item">
              <Link to="/find-doctors" className="nav-links">
                Find Doctors
              </Link>
            </li>
          )}
          
          <li className="nav-item">
            <Link to="/profile" className="nav-links">
              Profile
            </Link>
          </li>
          
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-links logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
