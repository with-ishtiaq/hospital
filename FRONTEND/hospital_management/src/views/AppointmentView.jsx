import React from 'react';
import DoctorAppointmentView from './DoctorAppointmentView';

// Thin wrapper to use the new hospital-cards appointment flow.
// This removes deprecated MUI Grid/Picker usage and avoids legacy API warnings.
const AppointmentView = () => {
  return <DoctorAppointmentView />;
};

export default AppointmentView;
