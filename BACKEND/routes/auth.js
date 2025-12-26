// auth.js - Handles registration and login for both roles
const verifyCaptcha = require('../middleware/recaptcha');
console.log('verifyCaptcha in auth.js:', verifyCaptcha);
console.log('Type in auth.js:', typeof verifyCaptcha);

const express = require('express');
const router = express.Router();
const { register, loginPatient, loginDoctor } = require('../controllers/authController');
console.log('register:', register);
console.log('loginPatient:', loginPatient);
console.log('loginDoctor:', loginDoctor);
const { logAction } = require('../utils/auditLogger');

// Registration routes with CAPTCHA
router.post('/register/patient', verifyCaptcha, register); // expects role='patient' in body
router.post('/register/doctor', verifyCaptcha, register); // expects role='doctor' in body

// Login routes with CAPTCHA
router.post('/login/patient', verifyCaptcha, loginPatient);
router.post('/login/doctor', verifyCaptcha, loginDoctor);

module.exports = router;
