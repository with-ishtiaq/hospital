import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Stethoscope, Activity, HeartPulse, Bell, Search, User } from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: '2023-06-15', time: '10:00 AM', status: 'confirmed' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'Dermatologist', date: '2023-06-20', time: '2:30 PM', status: 'pending' },
  ];

  const recentPrescriptions = [
    { id: 1, name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', date: '2023-05-28', refills: 3 },
    { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', date: '2023-05-28', refills: 2 },
  ];

  const healthMetrics = {
    bloodPressure: '120/80',
    heartRate: '72',
    glucose: '98',
    lastCheckup: '2023-05-15'
  };

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.8, available: true },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Dermatologist', rating: 4.7, available: true },
    { id: 3, name: 'Dr. Emily Wilson', specialty: 'Pediatrician', rating: 4.9, available: false },
  ];

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search doctors..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Appointments</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">2</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Blood Pressure</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{healthMetrics.bloodPressure}</div>
                      <span className="ml-2 text-sm text-green-600">Normal</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <HeartPulse className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Heart Rate</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{healthMetrics.heartRate} bpm</div>
                      <span className="ml-2 text-sm text-green-600">Normal</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Last Checkup</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {new Date(healthMetrics.lastCheckup).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointments */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Appointments</h3>
              </div>
              <div className="bg-white overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {upcomingAppointments.map((appointment) => (
                    <li key={appointment.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Stethoscope className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{appointment.doctor}</p>
                              <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-gray-500">{appointment.time}</p>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all appointments →
                  </button>
                </div>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Prescriptions</h3>
              </div>
              <div className="bg-white overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {recentPrescriptions.map((prescription) => (
                    <li key={prescription.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{prescription.name}</p>
                            <p className="text-sm text-gray-500">{prescription.dosage} • {prescription.frequency}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Prescribed on {new Date(prescription.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-gray-500">{prescription.refills} refills remaining</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all prescriptions →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/patient/book-appointment')}
                    className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50"
                  >
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900">Book Appointment</p>
                  </button>
                  <button
                    onClick={() => navigate('/patient/health-records')}
                    className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50"
                  >
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900">Health Records</p>
                  </button>
                  <button
                    onClick={() => navigate('/patient/doctors')}
                    className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50"
                  >
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                      <Stethoscope className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900">Find a Doctor</p>
                  </button>
                  <button
                    onClick={() => navigate('/patient/medicine')}
                    className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50"
                  >
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                      <HeartPulse className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900">Medicine</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Available Doctors */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Available Doctors</h3>
              </div>
              <div className="p-4">
                <ul className="divide-y divide-gray-200">
                  {filteredDoctors.map((doctor) => (
                    <li key={doctor.id} className="py-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            doctor.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <User className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doctor.name}</p>
                          <p className="text-sm text-gray-500 truncate">{doctor.specialty}</p>
                        </div>
                        <div className="inline-flex items-center text-sm text-yellow-600">
                          <span className="mr-1">★</span>
                          {doctor.rating}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/patient/doctors')}
                    className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View all doctors →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
