// Example in src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Respect dev bypass on doctor routes
      const bypass = localStorage.getItem('bypassAuth') === 'true';
      const path = window.location?.pathname || '';
      const onDoctorRoute = path.startsWith('/doctor');
      if (bypass || onDoctorRoute) {
        // Do not redirect during doctor dashboard bypass
        return Promise.reject(error);
      }

      // Default behavior for other areas
      localStorage.removeItem('token');
      const lastRole = localStorage.getItem('lastRole');
      const isValidRole = lastRole === 'doctor' || lastRole === 'patient';
      const target = isValidRole ? `/login/${lastRole}` : '/role-select';
      window.location.href = target;
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password, role) => {
    try {
      const normalizedRole = (role || '').toLowerCase();
      const isValidRole = normalizedRole === 'doctor' || normalizedRole === 'patient';
      if (!isValidRole) {
        throw new Error('Invalid role. Must be either "doctor" or "patient"');
      }
      const payload = { email, password };
      const response = await api.post(`/auth/login/${normalizedRole}`, payload);
      
      // Check if the response has the expected structure
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Remember last attempted role for better redirects
        if (isValidRole) {
          localStorage.setItem('lastRole', normalizedRole);
        } else {
          localStorage.removeItem('lastRole');
        }
        // Ensure we return the user data in a consistent format
        return {
          data: {
            success: true,
            token: response.data.token,
            user: response.data.user || { email } // Fallback to basic user data if not provided
          }
        };
      }
      
      // If we get here, the response didn't have the expected structure
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error.response || error);
      // Prefer express-validator first error message if present
      const validatorMsg = error.response?.data?.errors?.[0]?.msg;
      const backendMsg = error.response?.data?.message;
      const errorMessage = validatorMsg || backendMsg || error.message || 'Login failed. Please check your credentials and try again.';
      throw new Error(errorMessage);
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Check if the response has the expected structure
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Ensure we return the user data in a consistent format
        return {
          data: {
            success: true,
            token: response.data.token,
            user: response.data.user || { email: userData.email } // Fallback to basic user data if not provided
          }
        };
      }
      
      // If we get here, the response didn't have the expected structure
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Registration error:', error);
      // Provide a more user-friendly error message
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error?.message ||
                         error.message || 
                         'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  },
  getMe: () => api.get('/auth/me'),
  registerDoctor: (userData) => api.post('/auth/register/doctor', userData),
};

// Patient API
export const patientAPI = {
  getProfile: (id) => api.get(`/patient-profiles/${id}`),
  updateProfile: (id, data) => api.put(`/patient-profiles/${id}`, data),
  updateMedicalInfo: (id, data) => api.put(`/patient-profiles/${id}/medical-info`, data),
  uploadPrescription: (id, fileOrFormData) => {
    const formData = (fileOrFormData instanceof FormData)
      ? fileOrFormData
      : (() => {
          const fd = new FormData();
          fd.append('prescriptionFile', fileOrFormData);
          return fd;
        })();
    return api.post(`/patient-profiles/${id}/prescriptions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getPrescriptions: (id) => api.get(`/patient-profiles/${id}/prescriptions`),
  getMedicalHistory: (id) => api.get(`/patient-profiles/${id}/medical-history`),
};

// Doctor API
export const doctorAPI = {
  getProfile: (id) => api.get(`/doctors/${id}`),
  updateAvailability: (id, availability) => 
    api.post(`/doctors/${id}/availability`, { availability }),
  requestLeave: (id, leaveData) => 
    api.post(`/doctors/${id}/leaves`, leaveData),
  getPatients: (id) => api.get(`/doctor-dashboard/doctor/${id}/patients`),
  getAppointments: (id, params) => 
    api.get(`/doctor-dashboard/doctor/${id}/appointments`, { params: { ...params } }),
  createAppointment: (data) => 
    api.post('/doctor-dashboard/appointments', data),
  // Emergency cases
  getEmergencies: (id, params) => 
    api.get(`/doctors/${id}/emergencies`, { params }),
  assignEmergency: (caseId) => 
    api.put(`/emergencies/${caseId}/assign`),
  updateEmergencyStatus: (caseId, status) => 
    api.put(`/emergencies/${caseId}/status`, { status }),
};

// Appointment API
export const appointmentAPI = {
  getAppointments: (params) => 
    api.get('/appointments', { params }),
  createAppointment: (data) => 
    api.post('/appointments', data),
  updateAppointment: (id, data) => 
    api.put(`/appointments/${id}`, data),
  cancelAppointment: (id) => 
    api.delete(`/appointments/${id}`),
};

// Chatbot API
export const chatbotAPI = {
  chat: async (role, message) => {
    return api.post('/chatbot', { role, message });
  }
};

export default api;