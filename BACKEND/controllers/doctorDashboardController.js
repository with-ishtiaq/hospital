const PatientRecord = require('../models/patientRecordModel');
const Appointment = require('../models/appointmentModel');

// GET /api/doctor-dashboard/doctor/:doctorId/patients
exports.getDoctorPatients = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) return res.status(400).json({ message: 'doctorId is required' });

    const records = await PatientRecord.find({ doctorId })
      .sort({ updatedAt: -1 })
      .limit(500)
      .lean();

    const map = new Map();
    for (const r of records) {
      const key = r.patientId ? `id:${r.patientId}` : `name:${(r.patientName || '').toLowerCase()}`;
      if (!map.has(key)) {
        map.set(key, {
          patientId: r.patientId || null,
          patientName: r.patientName || 'Unknown',
          age: r.age ?? null,
          lastUpdatedAt: r.updatedAt,
          lastDocumentPath: r.documentPath || null,
        });
      }
    }

    return res.status(200).json({ success: true, data: Array.from(map.values()) });
  } catch (err) {
    console.error('getDoctorPatients error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/doctor-dashboard/doctor/:doctorId/appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) return res.status(400).json({ message: 'doctorId is required' });

    const { status, from, to, limit = 100 } = req.query;
    const query = { doctorId };
    if (status) query.status = status;
    if (from || to) {
      query.scheduledAt = {};
      if (from) query.scheduledAt.$gte = new Date(from);
      if (to) query.scheduledAt.$lte = new Date(to);
    }

    const appts = await Appointment.find(query)
      .sort({ scheduledAt: -1 })
      .limit(Math.min(parseInt(limit || 100, 10), 500));

    return res.status(200).json({ success: true, data: appts });
  } catch (err) {
    console.error('getDoctorAppointments error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/doctor-dashboard/doctor/:doctorId/patients/:patientId/history
// Optionally support ?patientName=... if patientId is not available
exports.getPatientHistory = async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;
    const { patientName } = req.query;
    if (!doctorId) return res.status(400).json({ message: 'doctorId is required' });

    const recordQuery = { doctorId };
    if (patientId && patientId !== 'null') {
      recordQuery.patientId = patientId;
    } else if (patientName) {
      recordQuery.patientName = { $regex: `^${patientName}$`, $options: 'i' };
    }

    const [records, appointments] = await Promise.all([
      PatientRecord.find(recordQuery).sort({ updatedAt: -1 }),
      Appointment.find({ doctorId, ...(patientId ? { patientId } : {}) }).sort({ scheduledAt: -1 })
    ]);

    return res.status(200).json({ success: true, data: { records, appointments } });
  } catch (err) {
    console.error('getPatientHistory error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
