const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatbotController');

// @route   POST api/chatbot/chat
// @desc    Send a message to the chatbot
// @access  Public
router.post('/chat', chat);

module.exports = router;