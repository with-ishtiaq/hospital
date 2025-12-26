// Load environment variables
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

// Debug: Log environment variables
console.log('Environment variables:');
console.log('HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? '✅ Set' : '❌ Not set');
console.log('HUGGINGFACE_MODEL:', process.env.HUGGINGFACE_MODEL || 'Not set');
console.log('----------------------');

if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('❌ Error: HUGGINGFACE_API_KEY is not set in .env file');
  process.exit(1);
}

const { HfInference } = require('@huggingface/inference');

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
console.log('Hugging Face client initialized');

// Test function for the model
async function testModel() {
  try {
    console.log('🚀 Testing Meditron-7B model...');
    console.log('This might take a moment as the model loads...\n');
    
    const startTime = Date.now();
    
    // Test with a medical question
    const response = await hf.textGeneration({
      model: process.env.HUGGINGFACE_MODEL || 'epfl-llm/meditron-7b',
      inputs: "What are the common symptoms of diabetes and when should someone see a doctor?",
      parameters: {
        max_new_tokens: parseInt(process.env.MAX_RESPONSE_TOKENS) || 300,
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        top_p: parseFloat(process.env.TOP_P) || 0.9
      }
    });
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('✅ Model response:');
    console.log('----------------------------------------');
    console.log(response.generated_text);
    console.log('----------------------------------------');
    console.log(`\n⏱️  Response time: ${duration.toFixed(2)} seconds`);
    
  } catch (error) {
    console.error('❌ Error testing model:');
    console.error(error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run the test
testModel();
