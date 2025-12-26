import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';

// Create the context
const HospitalContext = createContext();

// Custom hook to use the hospital context
export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};

// Provider component
export const HospitalProvider = ({ children }) => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoggedNetworkErrorRef = useRef(false);

  // Fetch hospitals from the API
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/hospitals');
      setHospitals(response.data.data || []);
      
      // If there's no selected hospital but we have hospitals, select the first one
      if (!selectedHospital && response.data.data?.length > 0) {
        setSelectedHospital(response.data.data[0]);
      }
      
      setError(null);
      hasLoggedNetworkErrorRef.current = false; // reset on success
    } catch (err) {
      // Log only once while backend might be restarting
      if (!hasLoggedNetworkErrorRef.current) {
        console.error('Error fetching hospitals:', err?.response?.data || err?.message || err);
        hasLoggedNetworkErrorRef.current = true;
      }
      setError('Failed to load hospitals. The server may be starting. Retrying...');
      // Retry once after a short delay on network error
      if (err?.message?.toLowerCase().includes('network') || err?.code === 'ERR_NETWORK') {
        setTimeout(() => {
          fetchHospitals();
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load hospitals on component mount
  useEffect(() => {
    fetchHospitals();
    
    // Load selected hospital from localStorage if available
    const savedHospital = localStorage.getItem('selectedHospital');
    if (savedHospital) {
      try {
        setSelectedHospital(JSON.parse(savedHospital));
      } catch (e) {
        console.error('Error parsing saved hospital:', e);
        localStorage.removeItem('selectedHospital');
      }
    }
  }, []);

  // Save selected hospital to localStorage when it changes
  useEffect(() => {
    if (selectedHospital) {
      localStorage.setItem('selectedHospital', JSON.stringify(selectedHospital));
    }
  }, [selectedHospital]);

  // Update the selected hospital
  const selectHospital = (hospital) => {
    if (!hospital || !hospital._id) {
      console.error('Invalid hospital object:', hospital);
      return;
    }
    setSelectedHospital(hospital);
  };

  // Get hospital by ID
  const getHospitalById = (id) => {
    return hospitals.find(hospital => hospital._id === id);
  };

  // Refresh the hospitals list
  const refreshHospitals = async () => {
    await fetchHospitals();
  };

  // Context value
  const value = {
    selectedHospital,
    hospitals,
    loading,
    error,
    selectHospital,
    getHospitalById,
    refreshHospitals,
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export default HospitalContext;
