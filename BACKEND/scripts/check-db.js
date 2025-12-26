const { Pool } = require('pg');
require('dotenv').config();

// Get database URL from environment variables
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:your_password@localhost:5432/centralized_db';

// Create a new pool
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkDatabase() {
  const client = await pool.connect();
  try {
    console.log('Connected to database successfully!');
    
    // List all tables in the public schema
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\nTables in the database:');
    console.log('----------------------');
    if (result.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      result.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDatabase();
