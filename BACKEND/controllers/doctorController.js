// doctorController.js - Handles doctor viewing all patients
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE || process.env.DATABASE_URL || process.env.DATABASE_URL_HOSPITAL1,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
  // Doctor: get all patients
  getAllPatients: async (req, res) => {
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
  },

  // Get all doctors (admin only)
  getAllDoctors: async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT u.id, u.email, u.first_name, u.last_name, d.specialization, d.degree, d.experience, d.hospital, d.emergency_contact
         FROM users u
         JOIN doctors d ON u.id = d.user_id`
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get doctor by ID (admin/doctor/self)
  getDoctorById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      if (parseInt(id) !== userId && userRole !== 'admin' && userRole !== 'doctor') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const result = await pool.query(
        `SELECT u.id, u.email, u.first_name, u.last_name, d.specialization, d.degree, d.experience, d.hospital, d.emergency_contact
         FROM users u
         JOIN doctors d ON u.id = d.user_id
         WHERE u.id = $1`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Create doctor (admin only)
  createDoctor: async (req, res) => {
    try {
      const { email, password, first_name, last_name, specialization, degree, experience, hospital, emergency_contact } = req.body;
      // Insert user
      const userResult = await pool.query(
        `INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES ($1, $2, 'doctor', $3, $4) RETURNING id`,
        [email, password, first_name, last_name]
      );
      const userId = userResult.rows[0].id;
      // Insert doctor
      await pool.query(
        `INSERT INTO doctors (user_id, specialization, degree, experience, hospital, emergency_contact) VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, specialization, degree, experience, hospital, emergency_contact]
      );
      res.status(201).json({ message: 'Doctor created', id: userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update doctor info (self or admin)
  updateDoctor: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      if (parseInt(id) !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const { first_name, last_name, specialization, degree, experience, hospital, emergency_contact } = req.body;
      // Update users table
      await pool.query(
        `UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3`,
        [first_name, last_name, id]
      );
      // Update doctors table
      await pool.query(
        `UPDATE doctors SET specialization = $1, degree = $2, experience = $3, hospital = $4, emergency_contact = $5 WHERE user_id = $6`,
        [specialization, degree, experience, hospital, emergency_contact, id]
      );
      res.json({ message: 'Doctor updated' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete doctor (admin only)
  deleteDoctor: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM doctors WHERE user_id = $1', [id]);
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
      res.json({ message: 'Doctor deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};
