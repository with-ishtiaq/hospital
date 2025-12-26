const { Client } = require('pg');
require('dotenv').config();

async function dropDatabase() {
  // Connect to the default 'postgres' database to drop the target database
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default database
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
  });

  const dbName = process.env.DB_NAME || 'healthcare_central';

  try {
    await client.connect();
    
    // Disconnect all active connections to the database
    console.log(`🔒 Terminating active connections to database: ${dbName}`);
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${dbName}'
      AND pid <> pg_backend_pid();
    `);
    
    console.log(`🗑️  Dropping database: ${dbName}`);
    await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' dropped successfully`);
  } catch (error) {
    console.error('❌ Error dropping database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

dropDatabase();
