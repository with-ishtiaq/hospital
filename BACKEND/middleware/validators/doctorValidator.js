const { body, param, query } = require('express-validator');

// Common validation for creating and updating a doctor
exports.doctorValidation = [
    body('doctorName')
        .trim()
        .notEmpty().withMessage('Doctor name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    
    body('department')
        .trim()
        .notEmpty().withMessage('Department is required')
        .isLength({ max: 100 }).withMessage('Department cannot exceed 100 characters'),
    
    body('specialization')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Specialization cannot exceed 200 characters'),
    
    body('degrees')
        .optional()
        .isArray().withMessage('Degrees must be an array')
        .custom((value) => {
            if (!Array.isArray(value)) return true;
            return value.every(degree => typeof degree === 'string' && degree.trim().length > 0);
        }).withMessage('Each degree must be a non-empty string'),
    
    body('phoneNumber')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10,15}$/).withMessage('Please enter a valid phone number (10-15 digits)'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    
    body('employeeId')
        .trim()
        .notEmpty().withMessage('Employee ID is required')
        .isLength({ max: 50 }).withMessage('Employee ID cannot exceed 50 characters'),
    
    body('consultationFee')
        .optional()
        .isNumeric().withMessage('Consultation fee must be a number')
        .isFloat({ min: 0 }).withMessage('Consultation fee cannot be negative'),
    
    body('availableDays')
        .optional()
        .isArray().withMessage('Available days must be an array')
        .custom((value) => {
            if (!Array.isArray(value)) return true;
            const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            return value.every(day => validDays.includes(day.toLowerCase()));
        }).withMessage('Invalid day provided. Must be one of: sunday, monday, tuesday, wednesday, thursday, friday, saturday'),
    
    body('availableTimeSlots')
        .optional()
        .isArray().withMessage('Available time slots must be an array')
        .custom((value) => {
            if (!Array.isArray(value)) return true;
            return value.every(slot => 
                typeof slot === 'object' && 
                slot !== null &&
                ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].includes(slot.day?.toLowerCase()) &&
                typeof slot.startTime === 'string' &&
                typeof slot.endTime === 'string' &&
                /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot.startTime) &&
                /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot.endTime)
            );
        }).withMessage('Invalid time slot format. Each slot must have day, startTime, and endTime in HH:MM format')
];

// Validation for doctor ID parameter
exports.doctorIdValidation = [
    param('id')
        .isMongoId().withMessage('Invalid doctor ID')
];

// Validation for department parameter
exports.departmentValidation = [
    param('department')
        .trim()
        .notEmpty().withMessage('Department is required')
        .isLength({ max: 100 }).withMessage('Department cannot exceed 100 characters')
];

// Validation for query parameters
exports.doctorQueryValidation = [
    query('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department cannot exceed 100 characters'),
    
    query('active')
        .optional()
        .isIn(['true', 'false']).withMessage('Active must be either true or false'),
    
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer')
        .toInt(),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
        .toInt(),
    
    query('sort')
        .optional()
        .isIn(['name', 'department', 'rating', 'consultationFee']).withMessage('Invalid sort field'),
    
    query('order')
        .optional()
        .isIn(['asc', 'desc']).withMessage('Order must be either asc or desc')
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
        .toInt()
];

// Validation for department parameter
exports.departmentValidation = [
    param('department')
        .trim()
        .notEmpty().withMessage('Department is required')
        .isLength({ max: 100 }).withMessage('Department cannot exceed 100 characters')
        .matches(/^[a-zA-Z\s-]+$/).withMessage('Department can only contain letters, spaces, and hyphens')
];

// Validation for doctor rating
exports.ratingValidation = [
    body('rating')
        .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5')
        .toFloat()
];
