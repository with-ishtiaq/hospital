const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const controller = require('../controllers/patientProfileController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/prescriptions');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'rx-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images and PDFs
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only image and PDF files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

// Get patient profile
router.get('/:patientId', controller.getPatientProfile);

// Update patient profile
router.put('/:patientId', controller.updatePatientProfile);

// Upload prescription
router.post(
    '/:patientId/prescriptions',
    upload.single('prescriptionFile'),
    controller.uploadPrescription
);

// Get all prescriptions for a patient
router.get('/:patientId/prescriptions', controller.getPatientPrescriptions);

// Get a specific prescription
router.get('/:patientId/prescriptions/:prescriptionId', controller.getPrescription);

// Download prescription file
router.get(
    '/:patientId/prescriptions/:prescriptionId/files/:fileId',
    controller.downloadPrescriptionFile
);

module.exports = router;
