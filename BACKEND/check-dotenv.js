const fs = require('fs');
const path = require('path');

console.log('Current directory:', __dirname);

// Try to read .env file directly
const envPath = path.join(__dirname, '.env');
console.log('Looking for .env at:', envPath);

try {
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists');
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('File content (API key masked):', 
      content.replace(/HUGGINGFACE_API_KEY=(.*)/, 'HUGGINGFACE_API_KEY=***'));
  } else {
    console.log('❌ .env file does not exist');
    console.log('Creating a test .env file...');
    fs.writeFileSync(envPath, 'TEST_VAR=test_value\n');
    console.log('Created test .env file');
  }
} catch (err) {
  console.error('Error accessing .env file:', err);
}
