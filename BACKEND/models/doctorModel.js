const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const availabilitySlotSchema = new mongoose.Schema({
    dayOfWeek: {
        type: Number, // 0-6 (Sunday-Saturday)
        required: true,
        min: 0,
        max: 6
    },
    startTime: {
        type: String, // Format: "HH:MM" in 24-hour format
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    endTime: {
        type: String, // Format: "HH:MM" in 24-hour format
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    slotDuration: {
        type: Number, // in minutes
        default: 30,
        min: 15,
        max: 120
    },
    isRecurring: {
        type: Boolean,
        default: true
    },
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        default: null // null means no expiration
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const leaveSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value >= this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const consultationTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number, // in minutes
        required: true,
        min: 5,
        max: 240
    },
    fee: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const doctorSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    role: {
        type: String,
        enum: ['doctor'],
        default: 'doctor'
    },

    specialization: {
        type: String,
        trim: true
    },
    degrees: [{
        type: String,
        trim: true
    }],
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    employeeId: {
        type: String,
        required: [true, 'Employee ID is required'],
        unique: true,
        trim: true
    },
    imagePath: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    // Availability and Scheduling
    availability: [availabilitySlotSchema],
    leaves: [leaveSchema],
    consultationTypes: [consultationTypeSchema],
    
    // Professional Details
    yearsOfExperience: {
        type: Number,
        min: 0,
        max: 100
    },
    languages: [{
        type: String,
        trim: true
    }],
    
    // Practice Information
    licenseNumber: {
        type: String,
        trim: true
    },
    licenseExpiry: {
        type: Date
    },
    
    // Performance Metrics
    totalConsultations: {
        type: Number,
        default: 0,
        min: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    ratingCount: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // Relationships
    assignedPatients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    
    // Consultation Settings
    consultationFee: {
        type: Number,
        min: 0
    },
    availableDays: [{
        type: String,
        enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    }],
    availableTimeSlots: [{
        day: {
            type: String,
            enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        },
        startTime: String, // Format: "HH:MM"
        endTime: String,   // Format: "HH:MM"
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    collection: "Doctors",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create indexes
doctorSchema.index({ doctorName: 1 });
doctorSchema.index({ department: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index({ employeeId: 1 }, { unique: true });
doctorSchema.index({ department: 1 });

// Virtual for doctor's full profile URL
doctorSchema.virtual('profileURL').get(function() {
    return `/doctors/${this._id}`;
});

// Pre-save hook to hash password and update timestamps
doctorSchema.pre('save', async function(next) {
    this.updatedAt = Date.now();
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Instance method to calculate average rating
doctorSchema.methods.calculateAverageRating = async function(newRating) {
    const totalRatings = this.rating.average * this.rating.count + newRating;
    this.rating.count += 1;
    this.rating.average = totalRatings / this.rating.count;
    return this.save();
};

module.exports = mongoose.model("Doctor", doctorSchema);
