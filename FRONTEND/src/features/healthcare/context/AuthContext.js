import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('healthcare_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // In a real app, you would make an API call here
      // const response = await api.post('/auth/login', credentials);
      
      // Mock response for demo purposes
      const mockUser = {
        id: '123',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        userType: credentials.userType, // 'doctor' or 'patient'
        token: 'mock-jwt-token',
        profileComplete: false // Will be set to true after profile setup
      };

      localStorage.setItem('healthcare_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Redirect based on profile completion status
      if (!mockUser.profileComplete) {
        navigate(`/${mockUser.userType}/profile-setup`);
      } else {
        navigate(`/${mockUser.userType}/dashboard`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // In a real app, you would make an API call here
      // const response = await api.post('/auth/register', userData);
      
      // Mock response for demo purposes
      const mockUser = {
        id: '123',
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        userType: userData.userType, // 'doctor' or 'patient'
        token: 'mock-jwt-token',
        profileComplete: false
      };

      localStorage.setItem('healthcare_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Redirect to profile setup
      navigate(`/${mockUser.userType}/profile-setup`);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // In a real app, you would make an API call here
      // const response = await api.put(`/users/${user.id}`, profileData, {
      //   headers: { Authorization: `Bearer ${user.token}` }
      // });
      
      // Update user in local storage and state
      const updatedUser = {
        ...user,
        ...profileData,
        profileComplete: true
      };
      
      localStorage.setItem('healthcare_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Redirect to dashboard after profile completion
      navigate(`/${user.userType}/dashboard`);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: error.message || 'Profile update failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('healthcare_user');
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isProfileComplete: user?.profileComplete || false,
    loading,
    login,
    register,
    updateProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
