const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const pharmacyController = require('../controllers/pharmacyController');

// Public routes
router.get('/medications', pharmacyController.getMedications);

// Doctor routes
router.post('/prescribe',
  authenticate,
  authorize(['doctor']),
  pharmacyController.prescribeMedication
);

// Patient routes
router.get('/my-prescriptions',
  authenticate,
  authorize(['patient']),
  pharmacyController.getPatientPrescriptions
);

module.exports = router;
