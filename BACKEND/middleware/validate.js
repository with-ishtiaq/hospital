const { body, validationResult } = require('express-validator');

// Validation rules for registration
const registerValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('first_name').notEmpty().withMessage('First name required'),
  body('last_name').notEmpty().withMessage('Last name required'),
  body('role').isIn(['patient', 'doctor']).withMessage('Role must be patient or doctor'),
  // Patient fields
  body('gender').if(body('role').equals('patient')).notEmpty(),
  body('dob').if(body('role').equals('patient')).notEmpty(),
  body('blood_group').if(body('role').equals('patient')).notEmpty(),
  body('address').if(body('role').equals('patient')).notEmpty(),
  // Doctor fields
  body('specialization').if(body('role').equals('doctor')).notEmpty(),
  body('degree').if(body('role').equals('doctor')).notEmpty(),
  body('experience').if(body('role').equals('doctor')).notEmpty(),
  // Shared
  body('hospital').notEmpty().withMessage('Hospital required'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { registerValidation, validate };
