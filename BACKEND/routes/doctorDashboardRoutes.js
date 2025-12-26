const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorDashboardController');
const doctorAuth = require('../middleware/auth/doctorAuth');
const validate = require('../middleware/validators/validate');
const {
  validateDoctorIdParam,
  validatePatientIdParamOptional,
  validateAppointmentsQuery,
  validatePatientHistoryQuery,
} = require('../middleware/validators/doctorDashboardValidator');

// Doctor's patients
router.get(
  '/doctor/:doctorId/patients',
  doctorAuth,
  validateDoctorIdParam,
  validate,
  controller.getDoctorPatients
);

// Doctor's appointments
router.get(
  '/doctor/:doctorId/appointments',
  doctorAuth,
  validateDoctorIdParam,
  validateAppointmentsQuery,
  validate,
  controller.getDoctorAppointments
);

// Patient history under a doctor (support patientId or patientName via query)
router.get(
  '/doctor/:doctorId/patients/:patientId/history',
  doctorAuth,
  validateDoctorIdParam,
  validatePatientIdParamOptional,
  validatePatientHistoryQuery,
  validate,
  controller.getPatientHistory
);

module.exports = router;
