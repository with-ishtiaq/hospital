const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: false,
  },
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  patientEmail: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled',
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  collection: 'Appointments',
  timestamps: true,
});

appointmentSchema.index({ doctorId: 1, scheduledAt: -1 });
appointmentSchema.index({ patientId: 1, scheduledAt: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
