const { Client } = require('pg');
const { exec } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

const runMigrations = async (database, schema = 'public') => {
  const client = new Client({
    connectionString: process.env[`DATABASE_URL_${database.toUpperCase()}`] || process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log(`Running migrations for ${database}...`);
    
    if (database !== 'central') {
      await client.query(`CREATE SCHEMA IF NOT EXISTS hospital_schema`);
    }

    const migrationCommand = `npx node-pg-migrate up --migrations-dir=./migrations/${database} --schema ${schema} --database-url "${process.env[`DATABASE_URL_${database.toUpperCase()}`] || process.env.DATABASE_URL}"`;
    
    return new Promise((resolve, reject) => {
      exec(migrationCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error running migrations for ${database}:`, error);
          return reject(error);
        }
        console.log(`Migrations for ${database} completed successfully`);
        console.log(stdout);
        resolve();
      });
    });

  } catch (error) {
    console.error(`Error connecting to database ${database}:`, error);
    throw error;
  } finally {
    await client.end();
  }
};

const runAllMigrations = async () => {
  try {
    console.log('Starting migrations for central database...');
    await runMigrations('central');
    
    for (let i = 1; i <= 6; i++) {
      console.log(`\nStarting migrations for hospital${i}...`);
      await runMigrations(`hospital${i}`, 'hospital_schema');
    }
    
    console.log('\nAll migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runAllMigrations();
