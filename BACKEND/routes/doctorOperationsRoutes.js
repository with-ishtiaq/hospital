const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorOperationsController');
const {
    validateUpdateAvailability,
    validateLeaveRequest,
    validateUpdateLeaveStatus,
    validateConsultationTypes,
    validateAssignPatient,
    validateGetDashboard
} = require('../middleware/validators/doctorOperationsValidator');

// Import authentication middleware
const { auth: authenticate, authorize } = require('../middleware/auth');

// Update doctor availability
router.post(
    '/:id/availability',
    authenticate,
    authorize(['doctor', 'admin']),
    validateUpdateAvailability,
    controller.updateDoctorAvailability
);

// Manage leave requests
router.post(
    '/:id/leaves',
    authenticate,
    authorize(['doctor']),
    validateLeaveRequest,
    controller.requestLeave
);

// Update leave status (admin only)
router.patch(
    '/:id/leaves/:leaveId',
    authenticate,
    authorize(['admin']),
    validateUpdateLeaveStatus,
    controller.updateLeaveStatus
);

// Update consultation types
router.post(
    '/:id/consultation-types',
    authenticate,
    authorize(['doctor', 'admin']),
    validateConsultationTypes,
    controller.updateConsultationTypes
);

// Assign patient to doctor (admin only)
router.post(
    '/:id/patients/:patientId',
    authenticate,
    authorize(['admin']),
    validateAssignPatient,
    controller.assignPatient
);

// Get doctor dashboard
router.get(
    '/:id/dashboard',
    authenticate,
    authorize(['doctor', 'admin']),
    validateGetDashboard,
    controller.getDoctorDashboard
);

module.exports = router;
