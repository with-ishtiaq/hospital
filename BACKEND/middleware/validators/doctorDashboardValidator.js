const { param, query } = require('express-validator');

exports.validateDoctorIdParam = [
  param('doctorId')
    .isMongoId().withMessage('Invalid doctorId'),
];

exports.validatePatientIdParamOptional = [
  param('patientId')
    .optional({ values: 'falsy' })
    .isMongoId().withMessage('Invalid patientId'),
];

exports.validateAppointmentsQuery = [
  query('status')
    .optional()
    .isIn(['scheduled', 'completed', 'cancelled', 'no_show']).withMessage('Invalid status'),
  query('from')
    .optional()
    .isISO8601().withMessage('from must be ISO date'),
  query('to')
    .optional()
    .isISO8601().withMessage('to must be ISO date'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 500 }).withMessage('limit must be 1..500')
    .toInt(),
];

exports.validatePatientHistoryQuery = [
  query('patientName')
    .optional()
    .isLength({ min: 1, max: 200 }).withMessage('patientName length 1..200')
    .trim(),
];
