const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Cache for database connections
const hospitalConnections = {};

// Central database connection
const centralDatabaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE;

if (!centralDatabaseUrl) {
  throw new Error('Central database URL is not set. Please set DATABASE_URL (preferred) or NEON_DATABASE in your .env file.');
}

const centralSequelize = new Sequelize(centralDatabaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Factory function to create hospital-specific connections
const createHospitalConnection = (hospitalDbUrl) => {
  if (!hospitalDbUrl) {
    throw new Error('Database URL is required to create a connection');
  }
  
  return new Sequelize(hospitalDbUrl, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
};

/**
 * Get a Sequelize instance for a specific hospital
 * @param {number} hospitalId - The ID of the hospital (1-5)
 * @returns {Sequelize} A Sequelize instance for the specified hospital
 */
const getHospitalSequelize = (hospitalId) => {
  // Validate hospital ID
  const validIds = [1, 2, 3, 4, 5];
  if (!validIds.includes(Number(hospitalId))) {
    throw new Error(`Invalid hospital ID: ${hospitalId}. Must be between 1 and 5.`);
  }

  // Check if we already have a connection for this hospital
  if (!hospitalConnections[hospitalId]) {
    const envVar = `DATABASE_URL_HOSPITAL${hospitalId}`;
    const dbUrl = process.env[envVar];
    
    if (!dbUrl) {
      // Fallback to central database if per-hospital URL is not configured
      console.warn(`Database URL not found for hospital ${hospitalId}. Using central database connection instead. Set ${envVar} in .env to enable dedicated DB.`);
      hospitalConnections[hospitalId] = centralSequelize;
    } else {
      hospitalConnections[hospitalId] = createHospitalConnection(dbUrl);
    }
  }
  
  return hospitalConnections[hospitalId];
};

// Test the database connection
const testConnection = async () => {
  try {
    // Test central database
    await centralSequelize.authenticate();
    console.log('✅ Central database connection has been established successfully.');
    
    // Test all hospital database connections
    for (let i = 1; i <= 5; i++) {
      const envVar = `DATABASE_URL_HOSPITAL${i}`;
      if (process.env[envVar]) {
        try {
          const hospitalSequelize = getHospitalSequelize(i);
          await hospitalSequelize.authenticate();
          console.log(`✅ Hospital ${i} database connection has been established successfully.`);
        } catch (error) {
          console.error(`❌ Error connecting to Hospital ${i} database:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = {
  centralSequelize,
  createHospitalConnection,
  getHospitalSequelize,
  testConnection,
};
