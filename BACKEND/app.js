const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Create a new PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE || process.env.DATABASE_URL_HOSPITAL1,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'success',
      timestamp: result.rows[0].now,
      database: 'Connected to PostgreSQL database successfully!'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to connect to the database',
      error: error.message
    });
  }
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);

// Serve static files from the React frontend app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!', message: err.message });
});

module.exports = app;