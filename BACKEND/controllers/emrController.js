const { pool } = require('../db');

// Add a medical record
exports.addMedicalRecord = async (req, res) => {
  const { record_type, record_date, description, details } = req.body;
  const patient_id = req.user.id;
  try {
    const result = await pool.query(
      'INSERT INTO medical_records (patient_id, record_type, record_date, description, details, recorded_by_doctor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [patient_id, record_type, record_date, description, details, req.user.role === 'doctor' ? req.user.id : null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all medical records for patient
exports.getPatientRecords = async (req, res) => {
  const patient_id = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM medical_records WHERE patient_id = $1 ORDER BY record_date DESC',
      [patient_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
