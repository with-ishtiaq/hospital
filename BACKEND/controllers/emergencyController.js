const EmergencyCase = require('../models/EmergencyCase');

// Create a new emergency case (patient, doctor, or system can create)
exports.create = async (req, res) => {
  try {
    const { patientId, summary, details, priority = 'high', tags = [] } = req.body;
    if (!patientId || !summary) {
      return res.status(400).json({ success: false, message: 'patientId and summary are required' });
    }
    const doc = await EmergencyCase.create({
      patientId,
      doctorId: null,
      reportedBy: req.user?.id || 'system',
      summary,
      details,
      priority,
      tags,
      status: 'open'
    });
    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error('Emergency create error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating emergency' });
  }
};

// List emergencies for a doctor
exports.listForDoctor = async (req, res) => {
  try {
    const { id } = req.params; // doctor id
    const { status } = req.query; // optional filter

    // Only allow the doctor to access their emergencies
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const query = {};
    // Show cases assigned to this doctor or unassigned (for triage)
    query.$or = [{ doctorId: id }, { doctorId: null }];
    if (status) query.status = status;

    const cases = await EmergencyCase.find(query)
      .populate('patientId', 'patientName email phone')
      .populate('doctorId', 'name email specialization')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: cases });
  } catch (err) {
    console.error('Emergency list error:', err);
    return res.status(500).json({ success: false, message: 'Server error listing emergencies' });
  }
};

// Assign current doctor to a case
exports.assignToSelf = async (req, res) => {
  try {
    const { caseId } = req.params;
    const updated = await EmergencyCase.findByIdAndUpdate(
      caseId,
      { doctorId: req.user.id, status: 'in_progress' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Case not found' });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Emergency assign error:', err);
    return res.status(500).json({ success: false, message: 'Server error assigning emergency' });
  }
};

// Update case status
exports.updateStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status } = req.body;
    if (!['open', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const updated = await EmergencyCase.findByIdAndUpdate(
      caseId,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Case not found' });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Emergency update status error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};
