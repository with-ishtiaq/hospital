const { pool } = require('../db');

// List all medications
exports.getMedications = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medications ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Prescribe medication (doctor)
exports.prescribeMedication = async (req, res) => {
  const { patient_id, medication_id, dosage, frequency, duration, quantity, notes } = req.body;
  const doctor_id = req.user.id;
  try {
    const result = await pool.query(
      'INSERT INTO prescriptions (patient_id, doctor_id, medication_id, prescription_date, dosage, frequency, duration, quantity, notes) VALUES ($1,$2,$3,NOW(),$4,$5,$6,$7,$8) RETURNING *',
      [patient_id, doctor_id, medication_id, dosage, frequency, duration, quantity, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all prescriptions for a patient
exports.getPatientPrescriptions = async (req, res) => {
  const patient_id = req.user.id;
  try {
    const result = await pool.query(
      'SELECT p.*, m.name AS medication_name FROM prescriptions p JOIN medications m ON p.medication_id = m.id WHERE p.patient_id = $1 ORDER BY prescription_date DESC',
      [patient_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
