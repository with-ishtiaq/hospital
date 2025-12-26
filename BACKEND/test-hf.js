// Simple test script for Hugging Face API
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

console.log('Testing Hugging Face API connection...');
console.log('API Key:', process.env.HUGGINGFACE_API_KEY ? '✅ Present' : '❌ Missing');

// Simple HTTP request test
const https = require('https');

const data = JSON.stringify({
  inputs: "What are the symptoms of diabetes?",
  parameters: {
    max_new_tokens: 50
  }
});

const options = {
  hostname: 'api-inference.huggingface.co',
  path: '/models/' + (process.env.HUGGINGFACE_MODEL || 'epfl-llm/meditron-7b'),
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('\nSending request to Hugging Face API...');

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers));
  
  let response = '';
  
  res.on('data', (chunk) => {
    response += chunk;
  });
  
  res.on('end', () => {
    try {
      console.log('\nResponse:', JSON.parse(response));
    } catch (e) {
      console.log('Raw Response:', response);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
