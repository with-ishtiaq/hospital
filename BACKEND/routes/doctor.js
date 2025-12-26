// doctor.js - Doctor-specific routes
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticate, requireRole } = require('../middleware/auth');

// Doctor can view all patients
router.get('/patients', authenticate, requireRole('doctor'), doctorController.getAllPatients);

// Get all doctors (admin only)
router.get('/', authenticate, requireRole('admin'), doctorController.getAllDoctors);

// Get doctor by ID (admin/doctor/self)
router.get('/:id', authenticate, doctorController.getDoctorById);

// Create doctor (admin only)
router.post('/', authenticate, requireRole('admin'), doctorController.createDoctor);

// Update doctor info (self or admin)
router.put('/:id', authenticate, doctorController.updateDoctor);

// Delete doctor (admin only)
router.delete('/:id', authenticate, requireRole('admin'), doctorController.deleteDoctor);

module.exports = router;
