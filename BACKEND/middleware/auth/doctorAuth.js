// Lightweight placeholder auth for doctors.
// In production, replace with JWT/session-based auth and role checks.

module.exports = function doctorAuth(req, res, next) {
  try {
    const headerDoctorId = req.header('x-doctor-id');
    const paramDoctorId = req.params.doctorId;

    if (!headerDoctorId) {
      return res.status(401).json({ message: 'Missing x-doctor-id header' });
    }

    // Attach user context
    req.user = { role: 'doctor', id: headerDoctorId };

    // Optional: enforce header doctorId matches route param when present
    if (paramDoctorId && headerDoctorId !== paramDoctorId) {
      return res.status(403).json({ message: 'Forbidden: doctorId mismatch' });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
