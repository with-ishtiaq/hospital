const { body, param, query } = require('express-validator');

// Validation for updating doctor availability
exports.validateUpdateAvailability = [
    param('id').isMongoId().withMessage('Invalid doctor ID'),
    body('availability').isArray().withMessage('Availability must be an array'),
    body('availability.*.dayOfWeek')
        .isInt({ min: 0, max: 6 })
        .withMessage('Day of week must be between 0 (Sunday) and 6 (Saturday)'),
    body('availability.*.startTime')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Invalid start time format. Use HH:MM in 24-hour format'),
    body('availability.*.endTime')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Invalid end time format. Use HH:MM in 24-hour format')
        .custom((value, { req, path }) => {
            const index = parseInt(path.match(/\d+/)[0]);
            const startTime = req.body.availability[index].startTime;
            return value > startTime;
        })
        .withMessage('End time must be after start time'),
    body('availability.*.slotDuration')
        .optional()
        .isInt({ min: 15, max: 120 })
        .withMessage('Slot duration must be between 15 and 120 minutes')
];

// Validation for leave requests
exports.validateLeaveRequest = [
    param('id').isMongoId().withMessage('Invalid doctor ID'),
    body('startDate')
        .isISO8601()
        .withMessage('Invalid start date format. Use ISO 8601 format')
        .custom(value => new Date(value) > new Date())
        .withMessage('Start date must be in the future'),
    body('endDate')
        .isISO8601()
        .withMessage('Invalid end date format. Use ISO 8601 format')
        .custom((value, { req }) => new Date(value) > new Date(req.body.startDate))
        .withMessage('End date must be after start date'),
    body('reason')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Reason must be between 10 and 500 characters')
];

// Validation for updating leave status
exports.validateUpdateLeaveStatus = [
    param('id').isMongoId().withMessage('Invalid doctor ID'),
    param('leaveId').isMongoId().withMessage('Invalid leave request ID'),
    body('status')
        .isIn(['approved', 'rejected', 'pending'])
        .withMessage('Invalid status. Must be one of: approved, rejected, pending')
];

// Validation for updating consultation types
exports.validateConsultationTypes = [
    param('id').isMongoId().withMessage('Invalid doctor ID'),
    body().isArray().withMessage('Consultation types must be an array'),
    body('*.name')
        .trim()
        .notEmpty()
        .withMessage('Consultation type name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),
    body('*.duration')
        .isInt({ min: 5, max: 240 })
        .withMessage('Duration must be between 5 and 240 minutes'),
    body('*.fee')
        .isFloat({ min: 0 })
        .withMessage('Fee must be a positive number'),
    body('*.isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean')
];

// Validation for assigning patients
exports.validateAssignPatient = [
    param('id').isMongoId().withMessage('Invalid doctor ID'),
    param('patientId').isMongoId().withMessage('Invalid patient ID')
];

// Validation for doctor dashboard
exports.validateGetDashboard = [
    param('id').isMongoId().withMessage('Invalid doctor ID'),
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid start date format. Use ISO 8601 format'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date format. Use ISO 8601 format')
        .custom((value, { req }) => {
            if (req.query.startDate && new Date(value) < new Date(req.query.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        })
];
