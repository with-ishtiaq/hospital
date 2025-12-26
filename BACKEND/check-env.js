require('dotenv').config();

console.log('🔍 Checking environment variables...');
console.log('HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? '✅ Set' : '❌ Not set');
console.log('HUGGINGFACE_MODEL:', process.env.HUGGINGFACE_MODEL || 'Using default (epfl-llm/meditron-7b)');
console.log('MAX_RESPONSE_TOKENS:', process.env.MAX_RESPONSE_TOKENS || 'Using default (300)');
console.log('TEMPERATURE:', process.env.TEMPERATURE || 'Using default (0.7)');
console.log('TOP_P:', process.env.TOP_P || 'Using default (0.9)');
