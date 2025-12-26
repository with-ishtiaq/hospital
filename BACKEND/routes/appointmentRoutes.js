const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const appointmentController = require('../controllers/appointmentController');

// Patient routes
router.post('/', 
  authenticate, 
  authorize(['patient']), 
  appointmentController.bookAppointment
);

router.get('/my-appointments', 
  authenticate, 
  authorize(['patient']), 
  appointmentController.getPatientAppointments
);

// Doctor routes
router.get('/doctor', 
  authenticate, 
  authorize(['doctor']), 
  appointmentController.getDoctorAppointments
);

// Get all appointments (admin/doctor)
router.get('/', authenticate, authorize(['admin', 'doctor']), appointmentController.getAllAppointments);

// Get appointment by ID (admin/doctor/patient if owned)
router.get('/:id', authenticate, appointmentController.getAppointmentById);

// Update appointment (admin/doctor/patient if owned)
router.put('/:id', authenticate, appointmentController.updateAppointment);

// Delete appointment (admin/doctor/patient if owned)
router.delete('/:id', authenticate, appointmentController.deleteAppointment);

module.exports = router;
