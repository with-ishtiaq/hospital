// Script to generate secure random secrets for JWT and sessions
const crypto = require('crypto');

// Generate a secure random string
function generateSecret(length = 64) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

console.log('=== SECURE RANDOM SECRETS ===');
console.log(`JWT_SECRET=${generateSecret(64)}`);
console.log(`SESSION_SECRET=${generateSecret(64)}`);
console.log('==============================');
console.log('Copy these values to your .env file and Vercel environment variables.');
