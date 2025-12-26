const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { 
    doctorValidation, 
    doctorIdValidation, 
    departmentValidation, 
    doctorQueryValidation,
    ratingValidation
} = require("../middleware/validators/doctorValidator");
const validateRequest = require("../middleware/validateRequest");
const { body } = require("express-validator");
const { auth, authorize } = require("../middleware/auth");
const doctorController = require("../controllers/doctorController");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'doctors');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Enhanced Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `doctor-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF)'));
    }
};

const upload = multer({ 
    storage,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only allow single file upload
    },
    fileFilter
});

// Apply authentication and authorization middleware to protected routes
router.use(auth);

/**
 * @route   GET /api/doctors/stats
 * @desc    Get doctor statistics
 * @access  Private/Admin
 */
// Apply the auth middleware first to ensure user is authenticated
router.get('/stats', 
    auth,                           // First check if user is authenticated
    authorize('admin'),            // Then check if user has admin role
    doctorController.getDoctorStats
);

/**
 * @route   GET /api/doctors/department/:department
 * @desc    Get doctors by department
 * @access  Public
 */
router.get('/department/:department', 
    validateRequest(departmentValidation),
    doctorController.getDoctorsByDepartment
);

/**
 * @route   POST /api/doctors
 * @desc    Create a new doctor
 * @access  Private/Admin
 */
router.post("/", 
    authorize('admin'),
    upload.single('image'), 
    validateRequest(doctorValidation),
    doctorController.createDoctor
);

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors with filtering and pagination
 * @access  Public
 */
router.get("/", 
    validateRequest(doctorQueryValidation),
    doctorController.getAllDoctors
);

/**
 * @route   GET /api/doctors/:id
 * @desc    Get single doctor by ID
 * @access  Public
 */
router.get("/:id", 
    validateRequest(doctorIdValidation),
    doctorController.getDoctorById
);

/**
 * @route   PUT /api/doctors/:id
 * @desc    Update a doctor
 * @access  Private/Admin
 */
router.put("/:id", 
    authorize('admin'),
    upload.single('image'),
    validateRequest([...doctorValidation, ...doctorIdValidation]),
    doctorController.updateDoctor
);

/**
 * @route   PATCH /api/doctors/:id/status
 * @desc    Update doctor's active status
 * @access  Private/Admin
 */
router.patch("/:id/status",
    authorize('admin'),
    validateRequest([
        ...doctorIdValidation,
        body('isActive').isBoolean()
    ]),
    doctorController.updateDoctorStatus
);

/**
 * @route   PATCH /api/doctors/:id/rating
 * @desc    Add/update doctor's rating
 * @access  Private/Patient
 */
router.patch("/:id/rating",
    authorize('patient'),
    validateRequest([...doctorIdValidation, ...ratingValidation]),
    doctorController.updateDoctorRating
);

/**
 * @route   DELETE /api/doctors/:id
 * @desc    Delete a doctor (soft delete)
 * @access  Private/Admin
 */
router.delete("/:id", 
    authorize('admin'),
    validateRequest(doctorIdValidation),
    doctorController.deleteDoctor
);

// Error handling middleware for multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
        });
    } else if (err) {
        // An unknown error occurred
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
    next();
});

module.exports = router;
