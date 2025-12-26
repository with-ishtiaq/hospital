import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PatientBookAppointment = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/hospitals`);
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed to load hospitals');
        setHospitals((json.data || []).filter(h => h && (h.appointmentUrl || h.website)));
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openUrl = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Book Appointment</h3>
          <p className="mt-1 text-sm text-gray-500">Open the hospital's existing appointment page.</p>
        </div>

        <div className="p-4">
          {loading && <div className="text-sm text-gray-600">Loading hospitals...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.map((h) => (
                <div key={h.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-900">{h.name}</div>
                  <div className="mt-1 text-xs text-gray-500 break-words">
                    {h.appointmentUrl || h.website}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openUrl(h.appointmentUrl)}
                      disabled={!h.appointmentUrl}
                      className="px-3 py-2 rounded-md text-white bg-blue-600 disabled:opacity-50"
                    >
                      Open Appointment
                    </button>
                    <button
                      type="button"
                      onClick={() => openUrl(h.website)}
                      disabled={!h.website}
                      className="px-3 py-2 rounded-md text-white bg-gray-900 disabled:opacity-50"
                    >
                      Open Website
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientBookAppointment;
