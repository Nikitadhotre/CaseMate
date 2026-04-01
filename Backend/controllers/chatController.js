const { generateChatResponse } = require('../services/geminiService');

/**
 * Handle chat requests with AI assistant
 * @route POST /api/chat
 * @body { "question": "user's question" }
 * @returns { "response": "AI response" }
 */
const chatWithAI = async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const { question } = req.body;

    // Validate input
    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question'
      });
    }

    // Trim and validate question is not empty
    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question cannot be empty'
      });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({
        success: false,
        message: 'AI service not configured. Please contact support.'
      });
    }

    console.log('User input:', trimmedQuestion);
    
    // Generate AI response
    const aiResponse = await generateChatResponse(trimmedQuestion);
    console.log('Final AI response length:', aiResponse.length);
    
    console.log('AI response generated successfully');

    // Return successful response
    return res.status(200).json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.error('Chat Controller Error:', error);
    console.error('Error stack:', error.stack);

    // Return error response
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get response from AI assistant'
    });
  }
};

module.exports = {
  chatWithAI
};