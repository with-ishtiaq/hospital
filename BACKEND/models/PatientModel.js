const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const patientSchema = new mongoose.Schema({
    // Basic Information
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
    },
    patientName: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
    },
    
    // Medical Profile
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
        default: null
    },
    height: {
        value: { type: Number, min: 0, max: 300 },
        unit: { type: String, enum: ['cm', 'in'], default: 'cm' }
    },
    weight: {
        value: { type: Number, min: 0, max: 500 },
        unit: { type: String, enum: ['kg', 'lb'], default: 'kg' }
    },
    allergies: [{
        name: { type: String, required: true },
        severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
        notes: String
    }],
    chronicConditions: [{
        name: { type: String, required: true },
        diagnosedDate: Date,
        notes: String
    }],
    currentMedications: [{
        name: { type: String, required: true },
        dosage: String,
        frequency: String,
        startDate: { type: Date, default: Date.now },
        prescribedBy: String,
        notes: String
    }],
    
    // Emergency Contact
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
        email: String,
        address: String
    },
    
    // System Fields
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: false
    },
    lastLogin: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    needsProfileCompletion: {
        type: Boolean,
        default: true
    },
    
    // Authentication tokens
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    // Prescriptions
    prescriptions: [{
        date: { type: Date, default: Date.now },
        doctorName: String,
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
        diagnosis: String,
        notes: String,
        medications: [{
            name: String,
            dosage: String,
            frequency: String,
            duration: String,
            instructions: String
        }],
        files: [{
            originalName: String,
            fileName: String,
            filePath: String,
            fileType: String,
            fileSize: Number,
            uploadedAt: { type: Date, default: Date.now }
        }],
        isActive: { type: Boolean, default: true }
    }]
}, {
    collection: 'Patient'
});

// Hash password before saving
patientSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
patientSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Match user entered password to hashed password in database
patientSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Check if the model has already been compiled
let Patient;
try {
    Patient = mongoose.model('Patient');
} catch (e) {
    // If the model doesn't exist, create it
    Patient = mongoose.model('Patient', patientSchema);
}

module.exports = Patient;
