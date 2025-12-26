import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Log state changes
  useEffect(() => {
    console.log('AuthProvider state updated:', { user, loading, error });
  }, [user, loading, error]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      console.log('loadUser - token exists:', !!token);
      
      if (!token) {
        console.log('No token found, setting loading to false');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching user data...');
        const response = await authAPI.getMe();
        console.log('User data response:', response.data);
        // Backend returns { success: true, user: {...} }
        setUser(response.data?.user || null);
      } catch (err) {
        console.error('Failed to load user', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password, role) => {
    try {
      console.log('Login attempt:', { email, role });
      setError(null);
      setLoading(true);
      
      const response = await authAPI.login(email, password, role);
      console.log('Login response:', response.data);
      
      if (response.data?.success && response.data?.token) {
        const { token, user } = response.data;
        // Ensure the user object has the role
        const userWithRole = { ...user, role: user.role || role };
        console.log('Setting user in state and localStorage');
        localStorage.setItem('token', token);
        setUser(userWithRole);
        return userWithRole;
      } else {
        const error = new Error('Invalid response from server');
        console.error('Login failed - invalid response:', response);
        throw error;
      }
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials and try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.register(userData);
      
      if (response.data?.success && response.data?.token) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        return user;
      } else {
        throw new Error('Registration failed: Invalid response from server');
      }
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isDoctor: user?.role === 'doctor',
    isPatient: user?.role === 'patient',
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
    // Safe fallback to avoid crashes if provider not yet mounted during transitions
    return {
      user: null,
      loading: true,
      error: null,
      login: async () => { throw new Error('Auth not initialized'); },
      register: async () => { throw new Error('Auth not initialized'); },
      logout: () => {},
      isAuthenticated: false,
      isAdmin: false,
      isDoctor: false,
      isPatient: false,
    };
  }
  return context;
};

export default AuthContext;
