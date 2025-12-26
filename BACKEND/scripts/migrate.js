require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { centralSequelize: sequelize, Sequelize } = require('../config/database');

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
}

// Run migrations
async function runMigrations() {
  const migrationFiles = fs.readdirSync(path.join(__dirname, '../migrations'))
    .filter(file => file.endsWith('.sql'))  // Changed to look for .sql files
    .sort();

  for (const file of migrationFiles) {
    try {
      console.log(`\n🔄 Running migration: ${file}`);
      const migrationSQL = fs.readFileSync(
        path.join(__dirname, '../migrations', file), 
        'utf8'
      );
      
      // Execute the raw SQL
      await sequelize.query(migrationSQL);
      console.log(`✅ Successfully ran migration: ${file}`);
    } catch (error) {
      console.error(`❌ Error running migration ${file}:`, error);
      throw error; // Re-throw to be caught by the main function
    }
  }
}

// Main function
async function main() {
  console.log('🚀 Starting database migrations...');
  
  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }

  // Run migrations
  try {
    await runMigrations();
    console.log('\n✨ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migrations
main();