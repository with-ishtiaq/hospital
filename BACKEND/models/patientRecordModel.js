const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false, // Optional to allow placeholder records
        unique: true,
        sparse: true,    // Allows multiple nulls
        trim: true,
        lowercase: true
    },
    patientName: {
        type: String,
        required: false, // Optional for initial creation
        trim: true
    },
    age: {
        type: Number,
        required: false, // Optional for initial creation 
        min: 0,
        max: 150
    },
    documentPath: {
        type: String,
        required: false
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: false // optional
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: false // optional link to Patient entity when available
    },
    lastLogin: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    collection: "PatientInformation", // Make sure this matches your MongoDB collection name
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('PatientRecord', patientRecordSchema);
