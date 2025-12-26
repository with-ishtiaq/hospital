// patientController.js - Handles patient info upload and retrieval
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE || process.env.DATABASE_URL || process.env.DATABASE_URL_HOSPITAL1,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

exports.uploadInfo = (req, res) => { res.send('Upload patient info'); };

exports.getOwnInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, p.gender, p.blood_group, p.address, p.medical_history, p.hospital
       FROM users u
       JOIN patients p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all patients (admin/doctor only)
exports.getAllPatients = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, p.gender, p.blood_group, p.address, p.medical_history, p.hospital
       FROM users u
       JOIN patients p ON u.id = p.user_id`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get patient by ID (admin/doctor only)
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, p.gender, p.blood_group, p.address, p.medical_history, p.hospital
       FROM users u
       JOIN patients p ON u.id = p.user_id
       WHERE u.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update patient info (self or admin)
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    if (parseInt(id) !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { first_name, last_name, gender, blood_group, address, medical_history, hospital } = req.body;
    // Update users table
    await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3`,
      [first_name, last_name, id]
    );
    // Update patients table
    await pool.query(
      `UPDATE patients SET gender = $1, blood_group = $2, address = $3, medical_history = $4, hospital = $5 WHERE user_id = $6`,
      [gender, blood_group, address, medical_history, hospital, id]
    );
    res.json({ message: 'Patient updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete patient (admin only)
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    // Only admin role should reach here due to route middleware
    await pool.query('DELETE FROM patients WHERE user_id = $1', [id]);
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
