const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

async function checkPgAuth() {
  try {
    console.log('Attempting to list PostgreSQL roles...');
    const { stdout: roles } = await execPromise('psql -U postgres -c "\\du"');
    console.log('✅ Successfully connected to PostgreSQL');
    console.log('Roles:', roles);
    
    // Check pg_hba.conf location
    const { stdout: hbaFile } = await execPromise('psql -U postgres -c "SHOW hba_file;" -t');
    console.log('pg_hba.conf location:', hbaFile.trim());
    
    // Show authentication methods (using Windows type command)
    try {
      const { stdout: hbaContent } = await execPromise(`type "${hbaFile.trim()}"`);
      console.log('\npg_hba.conf content:');
      console.log(hbaContent);
    } catch (readError) {
      console.log('\nCould not read pg_hba.conf directly. Here are the common authentication methods:');
      console.log('1. trust - No password required');
      console.log('2. md5 - Password authentication using MD5');
      console.log('3. password - Clear-text password authentication');
      console.log('4. peer - OS username matching');
      
      // Try to get the authentication method for the current user
      console.log('\nTrying to determine authentication method for current user...');
      try {
        const { stdout: currentUser } = await execPromise('whoami');
        console.log('Current OS user:', currentUser.trim());
        
        // Try to connect with current OS username
        console.log('\nTrying to connect with current OS username...');
        const { stdout: osAuthTest } = await execPromise(`psql -U ${currentUser.trim()} -c "SELECT current_user;"`);
        console.log('Successfully connected as:', osAuthTest.trim());
        console.log('\n✅ Try using your OS username for authentication');
        
      } catch (osAuthError) {
        console.log('Could not connect with OS username:', osAuthError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure PostgreSQL service is running');
    console.log('2. Check if your PostgreSQL user has the correct permissions');
    console.log('3. Verify if password authentication is required');
    console.log('4. Check if PostgreSQL is configured to accept connections');
    
    // Try to get service status
    try {
      console.log('\nChecking PostgreSQL service status...');
      const { stdout: serviceStatus } = await execPromise('Get-Service -Name postgresql* | Select-Object Name, Status');
      console.log('PostgreSQL Service Status:');
      console.log(serviceStatus);
    } catch (serviceError) {
      console.error('Could not check service status:', serviceError.message);
    }
  }
}

checkPgAuth();
