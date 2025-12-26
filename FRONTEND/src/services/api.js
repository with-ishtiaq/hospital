import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  // Patient auth
  loginPatient: (credentials) => api.post('/auth/login/patient', credentials),
  registerPatient: (userData) => api.post('/auth/register/patient', userData),
  
  // Doctor auth
  loginDoctor: (credentials) => api.post('/auth/login/doctor', credentials),
  registerDoctor: (userData) => api.post('/auth/register/doctor', userData),
  
  // Common
  getProfile: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

export const appointmentAPI = {
  getAppointments: () => api.get('/appointments/my-appointments'),
  bookAppointment: (data) => api.post('/appointments', data),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  cancelAppointment: (id) => api.delete(`/appointments/${id}`),
  getAvailableSlots: (doctorId, date) => 
    api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`),
};

export const doctorAPI = {
  getDoctors: () => api.get('/doctors'),
  getDoctor: (id) => api.get(`/doctors/${id}`),
  getDoctorSchedule: (doctorId) => api.get(`/doctors/${doctorId}/schedule`),
};

export const hospitalAPI = {
  getHospitals: () => api.get('/hospitals'),
  getHospital: (id) => api.get(`/hospitals/${id}`),
};

export const patientAPI = {
  getMedicalRecords: () => api.get('/patients/medical-records'),
  updateProfile: (data) => api.put('/patients/profile', data),
};

export default api;
