const express = require('express');
const router = express.Router();
const { auth, authorize, isDoctor } = require('../middleware/auth');
const emergencyController = require('../controllers/emergencyController');

// Create a new emergency case (doctor or patient)
router.post('/emergencies', auth, authorize('doctor', 'patient', 'admin'), emergencyController.create);

// List emergencies for a doctor (assigned to them or unassigned)
router.get('/doctors/:id/emergencies', auth, authorize('doctor', 'admin'), emergencyController.listForDoctor);

// Assign current doctor to a case
router.put('/emergencies/:caseId/assign', auth, isDoctor, emergencyController.assignToSelf);

// Update case status
router.put('/emergencies/:caseId/status', auth, authorize('doctor', 'admin'), emergencyController.updateStatus);

module.exports = router;
