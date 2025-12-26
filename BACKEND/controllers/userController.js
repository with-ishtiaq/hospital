const { pool } = require('../db');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, role FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user by ID (admin or self)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    if (userRole !== 'admin' && userId != id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const result = await pool.query('SELECT id, email, first_name, last_name, role FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role',
      [email, hashedPassword, first_name, last_name, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      // Unique violation
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user (admin or self)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    if (userRole !== 'admin' && userId != id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { email, password, first_name, last_name, role } = req.body;
    let query = 'UPDATE users SET email = $1, first_name = $2, last_name = $3';
    let params = [email, first_name, last_name];
    let paramIdx = 4;
    if (password) {
      query += `, password = $${paramIdx}`;
      params.push(await bcrypt.hash(password, 10));
      paramIdx++;
    }
    if (userRole === 'admin' && role) {
      query += `, role = $${paramIdx}`;
      params.push(role);
      paramIdx++;
    }
    query += ` WHERE id = $${paramIdx} RETURNING id, email, first_name, last_name, role`;
    params.push(id);
    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
