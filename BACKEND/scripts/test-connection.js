const { Client } = require('pg');

const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'BRB_Hospital_db',
  password: 'postgres',
  port: 5432,
};

async function testConnection() {
  const client = new Client(config);
  
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL');
    
    // List all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nTables in BRB_Hospital_db:');
    console.table(tables.rows);
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

testConnection();
