const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Log environment info
console.log('Environment:', process.env.NODE_ENV || 'development');

// Get the database connection string from environment variables
// Try multiple possible environment variable names for database URL
const connectionString = process.env.NEON_DATABASE || 
                       process.env.DATABASE_URL ||
                       process.env.DATABASE_URL_HOSPITAL1 ||
                       process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: Database connection string not found in environment variables.');
  console.error('Please set NEON_DATABASE or DATABASE_URL environment variable.');
  process.exit(1);
}

// Log database connection info (redacting password for security)
const dbInfo = new URL(connectionString);
console.log(`🔌 Connecting to database: ${dbInfo.protocol}//${dbInfo.hostname}${dbInfo.pathname}`);

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000, // 30 seconds
  max: 10 // max number of clients in the pool
});

// Get all migration files
const migrationsDir = path.join(__dirname, '..', 'migrations');

if (!fs.existsSync(migrationsDir)) {
  console.error(`❌ Error: Migrations directory not found at ${migrationsDir}`);
  process.exit(1);
}

let migrationFiles = [];
try {
  migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
} catch (error) {
  console.error(`❌ Error reading migrations directory: ${error.message}`);
  process.exit(1);
}

console.log(`📋 Found ${migrationFiles.length} migration(s) to run`);

// Run migrations
async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  const client = await pool.connect().catch(error => {
    console.error('❌ Failed to connect to database:', error.message);
    console.error('Connection string:', connectionString.replace(/:[^:]*@/, ':***@'));
    process.exit(1);
  });
  
  try {
    console.log('🔄 Starting transaction...');
    await client.query('BEGIN');
    
    // Create migrations table if it doesn't exist
    console.log('🔍 Checking migrations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        run_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Get already run migrations
    const { rows: completedMigrations } = await client.query('SELECT name FROM migrations');
    const completedMigrationNames = new Set(completedMigrations.map(m => m.name));
    
    let appliedMigrations = 0;
    
    // Run new migrations
    for (const file of migrationFiles) {
      if (!completedMigrationNames.has(file)) {
        console.log(`\n🔄 Running migration: ${file}`);
        
        try {
          const migrationPath = path.join(migrationsDir, file);
          console.log(`📄 Reading migration file: ${migrationPath}`);
          
          const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
          
          console.log('⚡ Executing SQL...');
          await client.query(migrationSQL);
          
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)', 
            [file]
          );
          
          appliedMigrations++;
          console.log(`✅ Successfully applied migration: ${file}`);
        } catch (error) {
          console.error(`❌ Error applying migration ${file}:`, error.message);
          throw error; // This will trigger the rollback
        }
      } else {
        console.log(`✓ Migration already applied: ${file}`);
      }
    }
    
    await client.query('COMMIT');
    
    if (appliedMigrations === 0) {
      console.log('\n✨ Database is up to date. No new migrations to run.');
    } else {
      console.log(`\n✨ Successfully applied ${appliedMigrations} migration(s)!`);
    }
    
    // Verify migrations
    const { rows: allMigrations } = await client.query('SELECT name FROM migrations ORDER BY run_at');
    console.log('\n📋 Applied migrations:');
    allMigrations.forEach((mig, i) => console.log(`  ${i + 1}. ${mig.name}`));
    
  } catch (error) {
    console.error('\n❌ Migration failed! Rolling back changes...');
    console.error('Error details:', error.message);
    
    try {
      await client.query('ROLLBACK');
      console.log('🔙 Successfully rolled back transaction');
    } catch (rollbackError) {
      console.error('Error during rollback:', rollbackError.message);
    }
    
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run migrations
runMigrations().catch(error => {
  console.error('Fatal error in migration process:', error);
  process.exit(1);
});
