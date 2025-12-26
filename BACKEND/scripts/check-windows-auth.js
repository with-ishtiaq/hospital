const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

async function checkWindowsAuth() {
  try {
    // Get current Windows username
    const { stdout: username } = await execPromise('echo %USERNAME%');
    const currentUser = username.trim();
    
    console.log(`Current Windows username: ${currentUser}`);
    console.log('Trying to connect to PostgreSQL...');
    
    // Try to connect with Windows username
    const { stdout } = await execPromise(`psql -U ${currentUser} -c "SELECT current_user, current_database();"`);
    
    console.log('✅ Successfully connected to PostgreSQL!');
    console.log('Connection details:');
    console.log(stdout);
    
    // List databases
    console.log('\nListing databases...');
    const { stdout: dbs } = await execPromise(`psql -U ${currentUser} -c "\\l"`);
    console.log(dbs);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure PostgreSQL service is running');
    console.log('2. Try connecting with: psql -U postgres');
    console.log('3. Check if your Windows username has access to PostgreSQL');
  }
}

checkWindowsAuth();
