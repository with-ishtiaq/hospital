import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, User, Stethoscope, Calendar, FileText, 
  MessageSquare, Settings, LogOut, Menu, X, Building2, Pill, Search 
} from 'lucide-react';

const Navigation = ({ userType, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Add scroll listener for navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50';
  };

  const patientNavItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
    { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Book Appointment', path: '/patient/book-appointment', icon: Calendar },
    { name: 'Hospitals', path: '/patient/hospitals', icon: Building2 },
    { name: 'Medicine', path: '/patient/medicine', icon: Pill },
    { name: 'Doctors', path: '/patient/doctors', icon: Search },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: FileText },
    { name: 'Health Records', path: '/patient/health-records', icon: Stethoscope },
    { name: 'Messages', path: '/patient/messages', icon: MessageSquare },
    { name: 'Profile', path: '/patient/profile', icon: User },
  ];

  const doctorNavItems = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: Home },
    { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'Patients', path: '/doctor/patients', icon: User },
    { name: 'Prescriptions', path: '/doctor/prescriptions', icon: FileText },
    { name: 'Messages', path: '/doctor/messages', icon: MessageSquare },
    { name: 'Profile', path: '/doctor/profile', icon: User },
  ];

  const navItems = userType === 'doctor' ? doctorNavItems : patientNavItems;

  return (
    <>
      {/* Mobile menu button */}
      <div className={`fixed top-4 left-4 z-50 md:hidden ${isOpen ? 'hidden' : 'block'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
        <div className="relative flex flex-col w-64 h-full bg-white shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {userType === 'doctor' ? 'DR' : 'PT'}
              </div>
              <span className="ml-3 font-medium">
                {userType === 'doctor' ? 'Doctor' : 'Patient'} Panel
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md ${isActive(item.path)}`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={onLogout}
              className="group flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {userType === 'doctor' ? 'DR' : 'PT'}
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                {userType === 'doctor' ? 'Doctor' : 'Patient'}
              </span>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md ${isActive(item.path)}`}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={onLogout}
                className="group flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
