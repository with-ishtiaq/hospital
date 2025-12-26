const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

// Send verification code
router.post('/send-code', verificationController.sendVerificationCode);

// Verify code
router.post('/verify', verificationController.verifyCode);

// Resend verification code
router.post('/resend-code', verificationController.resendVerificationCode);

module.exports = router;
