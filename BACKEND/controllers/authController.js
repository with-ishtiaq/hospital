// authController.js - Handles registration and login logic
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();
const { logAction } = require('../utils/auditLogger');

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE || process.env.DATABASE_URL || process.env.DATABASE_URL_HOSPITAL1,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
}

// Unified registration endpoint
exports.register = async (req, res) => {
  const { role, email, password, first_name, last_name, gender, dob, blood_group, address, hospital, medical_history, emergency_contact, specialization, degree, experience } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  try {
    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      await logAction(email, 'register_attempt', 'failed', ip, { error: 'User already exists' });
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert into users table
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role]
    );
    const userId = userResult.rows[0].id;
    if (role === 'patient') {
      await pool.query(
        'INSERT INTO patients (user_id, first_name, last_name, gender, dob, blood_group, address, hospital, medical_history, emergency_contact) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [userId, first_name, last_name, gender, dob, blood_group, address, hospital, medical_history, emergency_contact]
      );
    } else if (role === 'doctor') {
      await pool.query(
        'INSERT INTO doctors (user_id, first_name, last_name, specialization, degree, experience, hospital, emergency_contact) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [userId, first_name, last_name, specialization, degree, experience, hospital, emergency_contact]
      );
    }
    // Generate JWT
    const token = generateToken(userResult.rows[0]);
    // Log with user ID instead of email
    await logAction(userId, 'register', 'success', ip, { role, email });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    // Log with user ID if available, otherwise email
    await logAction(err.user_id || email, 'register_attempt', 'error', ip, { error: err.message });
    res.status(500).json({ error: 'Server error' });
  }
};

// Login Patient (unified users table)
exports.loginPatient = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'patient']);
    const user = userResult.rows[0];
    if (!user) {
      await logAction(email, 'login_attempt', 'failed', ip, { error: 'User not found' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      await logAction(email, 'login_attempt', 'failed', ip, { error: 'Invalid password' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    await logAction(email, 'login', 'success', ip, { role: 'patient' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    await logAction(email, 'login_attempt', 'error', ip, { error: err.message });
    res.status(500).json({ error: 'Server error' });
  }
};

// Login Doctor (unified users table)
exports.loginDoctor = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'doctor']);
    const user = userResult.rows[0];
    if (!user) {
      await logAction(email, 'login_attempt', 'failed', ip, { error: 'User not found' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      await logAction(email, 'login_attempt', 'failed', ip, { error: 'Invalid password' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    await logAction(email, 'login', 'success', ip, { role: 'doctor' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    await logAction(email, 'login_attempt', 'error', ip, { error: err.message });
    res.status(500).json({ error: 'Server error' });
  }
};
