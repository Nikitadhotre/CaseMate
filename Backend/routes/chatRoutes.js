const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/chatController');

// POST /api/chat - Chat with AI legal assistant
router.post('/', chatWithAI);

module.exports = router;