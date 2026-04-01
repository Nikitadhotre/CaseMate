const Groq = require('groq-sdk');

// Initialize Groq client with API key from environment
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Model configuration - using llama-3.3-70b-versatile (latest available model)
const MODEL_NAME = 'llama-3.3-70b-versatile';

/**
 * Generate a response using Groq API
 * @param {string} prompt - The user's question
 * @returns {string} - The AI response
 */
const generateGroqResponse = async (prompt) => {
  try {
    // Create chat completion request
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: MODEL_NAME,
      temperature: 0.3,
      max_tokens: 2048,
    });

    // Extract and return the response text
    const response = chatCompletion.choices[0]?.message?.content;

    if (!response || response.trim() === '') {
      throw new Error('Empty response from Groq API');
    }

    let cleanResponse = response.replace(/⚠️|🚨|📝|✅|❌|🔥|💡/g, '').trim();
    return cleanResponse;

  } catch (error) {
    console.error('Groq Service Error:', error.message);
    throw error;
  }
};

module.exports = {
  generateGroqResponse
};

