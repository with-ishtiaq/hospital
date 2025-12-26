const { Sequelize } = require('sequelize');
require('dotenv').config();

async function setupTestDatabases() {
  try {
    // Connect to the default postgres database using environment variables with fallbacks
    const dbConfig = {
      database: process.env.PGDATABASE || 'postgres',
      username: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      dialect: 'postgres',
      logging: false
    };

    const connectionString = `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
    
    console.log(`Connecting to PostgreSQL at ${dbConfig.host}:${dbConfig.port} as ${dbConfig.username}`);
    
    const sequelize = new Sequelize(connectionString, {
      logging: false,
      dialect: 'postgres'
    });

    console.log('Creating test databases...');
    
    // Create centralized test database
    await sequelize.query('DROP DATABASE IF EXISTS centralized_db_test;');
    await sequelize.query('CREATE DATABASE centralized_db_test;');
    console.log('✅ Created centralized_db_test database');

    // Create hospital test database
    await sequelize.query('DROP DATABASE IF EXISTS hospital1_test;');
    await sequelize.query('CREATE DATABASE hospital1_test;');
    console.log('✅ Created hospital1_test database');

    console.log('\n✅ Test databases created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up test databases:', error.message);
    process.exit(1);
  }
}

setupTestDatabases();
