const { testConnection } = require('./config/database');

async function test() {
  console.log('Testing database connections...');
  await testConnection();
  process.exit(0);
}

test().catch(console.error);
