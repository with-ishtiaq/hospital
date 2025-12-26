// server.js - Main entry point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const db = require('./models'); // Import models with sync functionality
const errorHandler = require('./middleware/errorHandler');
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');
const auditRequest = require('./middleware/auditMiddleware');
const { specs, swaggerUi, swaggerOptions } = require('./docs/api-docs');
require('dotenv').config();
require('dotenv').config();

// Minimal polyfill for Node < 20 to satisfy undici
if (typeof global.File === 'undefined') {
  global.File = class {};
}
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',  // Local development
  'http://localhost:3001',  // Alternate local port
  'http://localhost:5173',  // Vite dev server
  'http://192.168.56.1:3000',  // Local network development
  'https://fydp-database.vercel.app',  // Your Vercel app URL
  'https://*.vercel.app'  // Any Vercel preview URLs
];

// Add any custom domains from environment variable
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
      console.warn(msg);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);

// Log all requests for audit
app.use(auditRequest);

// Simple health check route
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    
    res.status(200).json({ 
      status: 'ok', 
      message: 'Server and database are running',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL (Neon)'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// API Routes
const apiRoutes = require('./routes'); // Load all routes
app.use('/api', apiRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static assets in production
// Serve static assets in production (only if a build exists)
if (process.env.NODE_ENV === 'production') {
  // Try several likely frontend build locations and only serve if one exists
  const candidates = [
    path.join(__dirname, '../client/build'),
    path.join(__dirname, '../FRONTEND/hospital_management/build'),
    path.join(__dirname, '../FRONTEND/build'),
  ];

  const buildPath = candidates.find((p) => {
    try { return fs.existsSync(path.join(p, 'index.html')); } catch { return false; }
  });

  if (buildPath) {
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
    console.log(`Serving frontend from: ${buildPath}`);
  } else {
    console.warn('No frontend build found. Skipping static file serving.');
  }
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    
    // Sync all databases without forcing recreation to preserve data
    console.log('🔧 Syncing database...');
    await db.syncDatabase({
      force: false,  // Don't drop existing tables
      alter: false   // Don't alter tables automatically
    });
    
    console.log('✅ Database synchronization completed successfully');

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      // Handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
        case 'EADDRINUSE':
          console.error(`Port ${PORT} is already in use`);
          process.exit(1);
        default:
          throw error;
      }
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log('🛑 Shutting down server...');
      
      try {
        // Close database connections
        await db.closeConnections();
        console.log('✅ Database connections closed');
        
        // Close the server
        server.close(() => {
          console.log('🛑 Server stopped');
          process.exit(0);
        });

        // Force close after 5 seconds
        setTimeout(() => {
          console.error('❌ Could not close connections in time, forcing shutdown');
          process.exit(1);
        }, 5000);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    // Handle process termination signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server when running server.js directly (local/dev)
if (require.main === module) {
  startServer().catch(error => {
    console.error('❌ Fatal error during startup:', error);
    process.exit(1);
  });
}

// Export the Express app for Vercel
module.exports = app;