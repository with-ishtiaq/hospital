const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupHospitalSchema(dbUrl, hospitalName) {
  console.log(`\nSetting up schema for ${hospitalName}...`);
  
  const pool = new Pool({ connectionString: dbUrl });
  const client = await pool.connect();
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'schema', 'hospital-schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf8');
    
    // Execute the schema SQL
    await client.query('BEGIN');
    await client.query(schemaSQL);
    await client.query('COMMIT');
    
    console.log(`✅ Successfully set up schema for ${hospitalName}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Error setting up schema for ${hospitalName}:`, error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function setupAllHospitalSchemas() {
  const hospitals = [
    { name: 'BRB_Hospital_db', url: process.env.DATABASE_URL_HOSPITAL1 },
    { name: 'Ibnesina_Hospital_db', url: process.env.DATABASE_URL_HOSPITAL2 },
    { name: 'Labaid_Hospital_db', url: process.env.DATABASE_URL_HOSPITAL3 },
    { name: 'Popular_Hospital_db', url: process.env.DATABASE_URL_HOSPITAL4 },
    { name: 'Square_Hospital_db', url: process.env.DATABASE_URL_HOSPITAL5 }
  ];

  for (const hospital of hospitals) {
    try {
      await setupHospitalSchema(hospital.url, hospital.name);
    } catch (error) {
      console.error(`Failed to set up ${hospital.name}:`, error.message);
    }
  }
  
  console.log('\n✅ All hospital schemas setup complete!');
}

// Run the setup
setupAllHospitalSchemas().catch(console.error);
