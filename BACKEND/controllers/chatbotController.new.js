const axios = require('axios');
const { validationResult } = require('express-validator');

// Local Python service URL
const LOCAL_LLM_SERVICE = 'http://localhost:8000/chat';

// Fallback to Hugging Face if needed
let hf;
if (process.env.NODE_ENV !== 'production' && process.env.HUGGINGFACE_API_KEY) {
  const { HfInference } = require('@huggingface/inference');
  hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
}

/**
 * @desc    Handle chatbot conversation
 * @route   POST /api/chatbot/chat
 * @access  Public
 */
const chat = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { message, role = 'patient' } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        try {
            // Try local Python service first
            const response = await axios.post(LOCAL_LLM_SERVICE, {
                message,
                role,
                max_length: 200,
                temperature: 0.7,
                top_p: 0.9
            });
            
            return res.status(200).json({
                success: true,
                response: response.data.response,
                source: 'local_meditron'
            });
            
        } catch (localError) {
            console.warn('Local LLM service failed, falling back to Hugging Face:', localError.message);
            
            if (!hf) {
                return res.status(503).json({
                    success: false,
                    message: 'AI service is currently unavailable',
                    error: 'No local service or Hugging Face API key configured'
                });
            }
            
            // Fallback to Hugging Face
            const prompt = role === 'doctor' 
                ? `[Doctor] ${message}`
                : `[Patient] ${message}`;

            try {
                const response = await hf.textGeneration({
                    model: process.env.HUGGINGFACE_MODEL || 'epfl-llm/meditron-7b',
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 250,
                        temperature: 0.7,
                        top_p: 0.9
                    }
                });

                return res.status(200).json({
                    success: true,
                    response: response.generated_text,
                    source: 'huggingface_api'
                });
            } catch (hfError) {
                console.error('Hugging Face API error:', hfError);
                throw new Error('Failed to get response from AI service');
            }
        }
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing your request',
            error: error.message
        });
    }
};

module.exports = {
    chat
};
