const db = require('../models');

// Helper to resolve hospitalId and fetch its central record
async function resolveHospital(req) {
  const paramId = req.params.hospitalId || req.query.hospitalId || req.hospitalId;
  const hospitalId = Number(paramId) || 1;
  const hospital = await db.Hospital.findByPk(hospitalId);
  return { hospitalId, hospital };
}

// Book appointment -> respond with hyperlink to hospital portal
exports.bookAppointment = async (req, res) => {
  try {
    const { hospitalId, hospital } = await resolveHospital(req);
    if (!hospital || !hospital.appointmentUrl) {
      return res.status(404).json({
        message: 'Hospital appointment portal not configured',
        hospitalId,
      });
    }
    return res.status(202).json({
      action: 'redirect',
      hospitalId,
      url: hospital.appointmentUrl,
    });
  } catch (err) {
    console.error('bookAppointment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Doctor appointments -> hyperlink
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { hospitalId, hospital } = await resolveHospital(req);
    if (!hospital || !hospital.appointmentUrl) {
      return res.status(404).json({ message: 'Hospital appointment portal not configured', hospitalId });
    }
    return res.json({
      action: 'redirect',
      hospitalId,
      url: hospital.appointmentUrl,
    });
  } catch (err) {
    console.error('getDoctorAppointments error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Patient appointments -> hyperlink
exports.getPatientAppointments = async (req, res) => {
  try {
    const { hospitalId, hospital } = await resolveHospital(req);
    if (!hospital || !hospital.appointmentUrl) {
      return res.status(404).json({ message: 'Hospital appointment portal not configured', hospitalId });
    }
    return res.json({
      action: 'redirect',
      hospitalId,
      url: hospital.appointmentUrl,
    });
  } catch (err) {
    console.error('getPatientAppointments error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin/doctor list -> hyperlink
exports.getAllAppointments = async (req, res) => {
  try {
    const { hospitalId, hospital } = await resolveHospital(req);
    if (!hospital || !hospital.appointmentUrl) {
      return res.status(404).json({ message: 'Hospital appointment portal not configured', hospitalId });
    }
    return res.json({
      action: 'redirect',
      hospitalId,
      url: hospital.appointmentUrl,
    });
  } catch (err) {
    console.error('getAllAppointments error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// The following endpoints now provide guidance/redirects
exports.getAppointmentById = async (req, res) => {
  try {
    const { hospitalId, hospital } = await resolveHospital(req);
    if (!hospital || !hospital.appointmentUrl) {
      return res.status(404).json({ message: 'Hospital appointment portal not configured', hospitalId });
    }
    return res.json({
      action: 'redirect',
      hospitalId,
      url: hospital.appointmentUrl,
      note: 'Fetch a specific appointment from the hospital portal',
    });
  } catch (err) {
    console.error('getAppointmentById error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { hospitalId, hospital } = await resolveHospital(req);
    if (!hospital || !hospital.appointmentUrl) {
      return res.status(404).json({ message: 'Hospital appointment portal not configured', hospitalId });
    }
    return res.status(202).json({
      action: 'redirect',
      hospitalId,
      url: hospital.appointmentUrl,
      note: 'Update an appointment within the hospital portal',
    });
  } catch (err) {
    console.error('updateAppointment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { hospitalId, hospital } = await resolveHospital(req);
    if (!hospital || !hospital.appointmentUrl) {
      return res.status(404).json({ message: 'Hospital appointment portal not configured', hospitalId });
    }
    return res.status(202).json({
      action: 'redirect',
      hospitalId,
      url: hospital.appointmentUrl,
      note: 'Delete an appointment within the hospital portal',
    });
  } catch (err) {
    console.error('deleteAppointment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
