const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const { validationResult } = require('express-validator');

/**
 * @desc    Add or update doctor availability slots
 * @route   POST /api/doctors/:id/availability
 * @access  Private/Doctor
 */
const updateDoctorAvailability = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const { availability } = req.body;
        const doctor = await Doctor.findById(req.params.id);
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Replace existing availability
        doctor.availability = availability;
        const updatedDoctor = await doctor.save();

        res.status(200).json({
            success: true,
            data: updatedDoctor.availability
        });
    } catch (error) {
        console.error('Error updating doctor availability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update availability',
            error: error.message
        });
    }
};

/**
 * @desc    Request leave
 * @route   POST /api/doctors/:id/leaves
 * @access  Private/Doctor
 */
const requestLeave = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const { startDate, endDate, reason } = req.body;
        const doctor = await Doctor.findById(req.params.id);
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const newLeave = {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: 'pending'
        };

        doctor.leaves.push(newLeave);
        await doctor.save();

        res.status(201).json({
            success: true,
            data: doctor.leaves[doctor.leaves.length - 1]
        });
    } catch (error) {
        console.error('Error requesting leave:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to request leave',
            error: error.message
        });
    }
};

/**
 * @desc    Update leave status (for admins)
 * @route   PATCH /api/doctors/:id/leaves/:leaveId
 * @access  Private/Admin
 */
const updateLeaveStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const { status } = req.body;
        const doctor = await Doctor.findOne({
            _id: req.params.id,
            'leaves._id': req.params.leaveId
        });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor or leave request not found'
            });
        }

        const leave = doctor.leaves.id(req.params.leaveId);
        leave.status = status;
        leave.updatedAt = Date.now();
        
        await doctor.save();

        res.status(200).json({
            success: true,
            data: leave
        });
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update leave status',
            error: error.message
        });
    }
};

/**
 * @desc    Add or update consultation types
 * @route   POST /api/doctors/:id/consultation-types
 * @access  Private/Doctor
 */
const updateConsultationTypes = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const { consultationTypes } = req.body;
        const doctor = await Doctor.findById(req.params.id);
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        doctor.consultationTypes = consultationTypes;
        const updatedDoctor = await doctor.save();

        res.status(200).json({
            success: true,
            data: updatedDoctor.consultationTypes
        });
    } catch (error) {
        console.error('Error updating consultation types:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update consultation types',
            error: error.message
        });
    }
};

/**
 * @desc    Assign patient to doctor
 * @route   POST /api/doctors/:id/patients/:patientId
 * @access  Private/Admin
 */
const assignPatient = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        const patient = await Patient.findById(req.params.patientId);
        
        if (!doctor || !patient) {
            return res.status(404).json({
                success: false,
                message: 'Doctor or patient not found'
            });
        }

        // Add patient to doctor's assigned patients if not already assigned
        if (!doctor.assignedPatients.includes(patient._id)) {
            doctor.assignedPatients.push(patient._id);
            await doctor.save();
        }

        // Update patient's doctor reference
        if (!patient.doctorId || !patient.doctorId.equals(doctor._id)) {
            patient.doctorId = doctor._id;
            await patient.save();
        }

        res.status(200).json({
            success: true,
            message: 'Patient assigned to doctor successfully',
            data: {
                doctorId: doctor._id,
                patientId: patient._id
            }
        });
    } catch (error) {
        console.error('Error assigning patient to doctor:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign patient to doctor',
            error: error.message
        });
    }
};

/**
 * @desc    Get doctor's dashboard statistics
 * @route   GET /api/doctors/:id/dashboard
 * @access  Private/Doctor
 */
const getDoctorDashboard = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate('assignedPatients', 'patientName email phone')
            .select('assignedPatients totalConsultations averageRating consultationTypes');
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Get upcoming appointments (you'll need to implement this based on your appointment model)
        const upcomingAppointments = []; // Replace with actual appointment query
        
        // Get recent patients (last 5 assigned)
        const recentPatients = await Patient.find({ doctorId: doctor._id })
            .sort({ lastLogin: -1 })
            .limit(5)
            .select('patientName email phone lastLogin');

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalPatients: doctor.assignedPatients.length,
                    totalConsultations: doctor.totalConsultations,
                    averageRating: doctor.averageRating,
                    upcomingAppointments: upcomingAppointments.length
                },
                recentPatients,
                consultationTypes: doctor.consultationTypes,
                upcomingAppointments
            }
        });
    } catch (error) {
        console.error('Error getting doctor dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get doctor dashboard',
            error: error.message
        });
    }
};

module.exports = {
    updateDoctorAvailability,
    requestLeave,
    updateLeaveStatus,
    updateConsultationTypes,
    assignPatient,
    getDoctorDashboard
};
