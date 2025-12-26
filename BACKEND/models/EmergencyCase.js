const mongoose = require('mongoose');

const EmergencyCaseSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'PatientRecord', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
    reportedBy: { type: String }, // optional free text or system
    summary: { type: String, required: true },
    details: { type: String },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open', index: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmergencyCase', EmergencyCaseSchema);
