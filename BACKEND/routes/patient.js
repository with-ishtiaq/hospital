// patient.js - Patient-specific routes
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate, requireRole } = require('../middleware/auth');

// Patient can only access their own info
router.get('/me', authenticate, requireRole('patient'), patientController.getOwnInfo);

// Get all patients (admin/doctor only)
router.get('/', authenticate, requireRole(['admin', 'doctor']), patientController.getAllPatients);

// Get patient by ID (admin/doctor only)
router.get('/:id', authenticate, requireRole(['admin', 'doctor']), patientController.getPatientById);

// Update patient info (self or admin)
router.put('/:id', authenticate, patientController.updatePatient);

// Delete patient (admin only)
router.delete('/:id', authenticate, requireRole('admin'), patientController.deletePatient);

module.exports = router;
