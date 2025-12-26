const { Sequelize } = require('sequelize');
const { centralSequelize, getHospitalSequelize } = require('../config/database');
const path = require('path');
const fs = require('fs');

// Central database models
const db = {
  Sequelize,
  sequelize: centralSequelize,
};

const initModel = (sequelize, model) => {
  // If it's already an initialized Sequelize model/class, do NOT invoke it.
  if (model && (model.sequelize || model.getTableName || model.rawAttributes)) {
    return model;
  }

  // Only call factory functions that accept arguments (sequelize, [Sequelize])
  if (typeof model === 'function' && model.length >= 1) {
    return model(sequelize, Sequelize);
  }

  // As-is for anything else
  return model;
};

// Import and initialize central models
const centralModels = {
  User: require('./User'),
  AuditLog: require('./AuditLog'),
  Hospital: require('./Hospital'),
  // Hospital-scoped models are initialized via getHospitalDb()
};

// Initialize central models
Object.keys(centralModels).forEach(modelName => {
  if (centralModels[modelName]) {
    db[modelName] = initModel(centralSequelize, centralModels[modelName]);
  }
});

// Setup associations if they exist in the models
Object.keys(db).forEach(modelName => {
  if (db[modelName] && typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

// Hospital database models setup
const setupHospitalModels = require('./hospital');

// Function to get hospital models with a specific hospital database connection
const getHospitalDb = async (hospitalId) => {
  try {
    // Map non-numeric or out-of-range IDs (e.g., UUIDs) to default hospital 1
    const n = Number(hospitalId);
    const normalizedId = Number.isFinite(n) && n >= 1 && n <= 5 ? n : 1;
    const hospitalSequelize = getHospitalSequelize(normalizedId);

// Ensure the schema exists in this hospital DB
await hospitalSequelize.query('CREATE SCHEMA IF NOT EXISTS hospital_schema');

const hospitalModels = setupHospitalModels(hospitalSequelize, Sequelize);
    
    // Setup associations for hospital models
    Object.keys(hospitalModels).forEach(modelName => {
      if (hospitalModels[modelName] && hospitalModels[modelName].associate) {
        hospitalModels[modelName].associate(hospitalModels);
      }
    });

    return {
      models: hospitalModels,
      sequelize: hospitalSequelize,
    };
  } catch (error) {
    console.error(`Error getting hospital database for hospital ${hospitalId}:`, error);
    throw error;
  }
};

db.getHospitalDb = getHospitalDb;

// Sync function to create all tables if they don't exist
const syncDatabase = async (options = {}) => {
  const { force = false, alter = false } = options;
  
  try {
    console.log('Starting database synchronization...');
    
    // Sync central database
    console.log('Syncing central database...');
    await centralSequelize.sync({ force, alter });
    console.log('Central database synchronized successfully');

    // Get all hospitals from the central database
    let hospitals = [];
    try {
      hospitals = await db.Hospital.findAll();
      console.log(`Found ${hospitals.length} hospitals to sync`);
    } catch (err) {
      console.warn('Could not fetch hospitals, syncing with default hospital...', err.message);
      // If Hospital table doesn't exist yet, sync with a default hospital
      hospitals = [{ id: 1 }];
    }

    // Sync each hospital database
   for (const hospital of hospitals) {
  const hospitalId = hospital.id || hospital;
  const n = Number(hospitalId);
  const normalizedId = Number.isFinite(n) && n >= 1 && n <= 5 ? n : 1;
  console.log(`Syncing database for hospital ${hospitalId} (using connection ${normalizedId})...`);
  
  try {
    const { sequelize } = await getHospitalDb(normalizedId);
    await sequelize.sync({ force, alter });
    console.log(`Hospital ${hospitalId} database synchronized successfully`);
      } catch (err) {
        console.error(`Error syncing hospital ${hospitalId} database:`, err.message);
        // Continue with other hospitals even if one fails
      }
    }

    console.log('All databases synchronized successfully');
    return true;
  } catch (error) {
    console.error('Error syncing databases:', error);
    throw error;
  }
};

db.syncDatabase = syncDatabase;

// Add a function to close all database connections
const closeConnections = async () => {
  try {
    await centralSequelize.close();
    console.log('Central database connection closed');
  } catch (err) {
    console.error('Error closing central database connection:', err);
  }
};

db.closeConnections = closeConnections;

module.exports = db;