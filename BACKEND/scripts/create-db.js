const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // Parse the DATABASE_URL to get connection details
  const dbUrl = new URL(process.env.DATABASE_URL);
  const dbName = dbUrl.pathname.replace('/', '');
  
  // Create a connection string to the default 'postgres' database
  const rootDbUrl = new URL(process.env.DATABASE_URL);
  rootDbUrl.pathname = '/postgres'; // Connect to default database

  const client = new Client({
    connectionString: rootDbUrl.toString(),
    ssl: {
      rejectUnauthorized: false // Required for Neon
    }
  });

  try {
    await client.connect();
    console.log(`🔄 Creating database: ${dbName}`);
    
    // Check if database exists
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
    
    if (res.rows.length === 0) {
      // Create the database if it doesn't exist
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`ℹ️  Database '${dbName}' already exists`);
    }
  } catch (error) {
    console.error('❌ Error creating database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

