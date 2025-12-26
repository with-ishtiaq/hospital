const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { registerValidation, validate } = require('../middleware/validate');

// Unified register route (handles both patient and doctor)
router.post('/register', registerValidation, validate, authController.register);
router.post('/login/patient', authController.loginPatient);
router.post('/login/doctor', authController.loginDoctor);

// Protected route to get current user info
router.get('/me', 
  authenticate, 
  (req, res) => {
    res.json({ user: req.user });
  }
);

// Doctor: get all patients
router.get('/patients', authenticate, authorize(['doctor']), authController.getAllPatients);

// Patient: get all doctors
router.get('/doctors', authenticate, authorize(['patient']), authController.getAllDoctors);

module.exports = router;
