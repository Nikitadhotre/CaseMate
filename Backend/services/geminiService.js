const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateGroqResponse } = require('./groqService');

// Initialize with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model configuration - using gemini-1.5-flash-latest as specified
const MODEL_NAME = 'gemini-1.5-flash-latest';

/**
 * Generate a chat response - tries Gemini first, then falls back to Groq
 * @param {string} userInput - The user's question
 * @returns {string} - The AI response
 */
const generateChatResponse = async (userInput) => {
  // Create the prompt with legal assistant instructions - STRICT FORMATTING
const prompt = `
You are CaseMate AI Legal Assistant.

Your job:
- Explain legal concepts in simple and clear language
- Keep answers easy to read and not too long

Rules:
- Do NOT add introduction or extra sections like "Factors", "Examples"
- Use numbered steps when explaining a process
- Keep content structured and readable
- Use simple language
- Avoid long paragraphs
- Do NOT use emojis

Formatting:
- Start directly with the answer
- Use numbered points if needed
- Add a short section:

**Note:**
- 1–2 helpful lines

- End EXACTLY with:
Consult a qualified lawyer.

User Question:
"${userInput}"

Give a clean, structured answer.
`;

  // Step 1: Try Gemini API
  console.log('Full prompt being sent:', prompt.substring(0, 200) + '...');
  console.log('User input:', userInput);
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt, {
      generationConfig: {
        temperature: 0.3
      }
    });
    const response = result.response;
    let text = response.text();

    if (!text || text.trim() === '') {
      throw new Error('Empty response from Gemini');
    }

    // Remove any remaining emojis for clean professional look
    text = text.replace(/⚠️|🚨|📝|✅|❌|🔥|💡|📱|⚖️|📋/g, '').trim();
    return text;
  } catch (geminiError) {
    console.log('Gemini failed, switching to Groq...');
    console.error('Gemini Error:', geminiError.message);

    // Step 2: If Gemini fails, try Groq
    try {
      const groqResponse = await generateGroqResponse(prompt);
      return groqResponse;
    } catch (groqError) {
      console.error('Groq Error:', groqError.message);
      throw new Error('Both Gemini and Groq failed. Please try again later.');
    }
  }
};

module.exports = { generateChatResponse };

