const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const emrController = require('../controllers/emrController');

// Add medical record (doctors/nurses only)
router.post('/',
  authenticate,
  authorize(['doctor', 'nurse']),
  emrController.addMedicalRecord
);

// Get medical records (doctors/nurses can view any, patients only their own)
router.get('/patient/:patientId?',
  authenticate,
  authorize(['doctor', 'nurse', 'patient']),
  emrController.getPatientRecords
);

module.exports = router;
