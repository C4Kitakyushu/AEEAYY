const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

// Read the token once at the top level
const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'say',
  description: 'generate a voice message based on the prompt',
  role: 1,
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    if (!Array.isArray(args) || args.length === 0) {
      return await sendError(senderId, 'Error: Please provide a message to convert to voice.', pageAccessToken);
    }

    const prompt = args.join(' ').trim();
    await handleVoiceMessage(senderId, prompt, pageAccessToken);
  },
};

// Function to generate voice message
const handleVoiceMessage = async (senderId, prompt, pageAccessToken) => {
  try {
    const apiUrl = `https://api.joshweb.click//api/aivoice?q=${encodeURIComponent(prompt)}&id=8`;

    console.log('Sending message with API URL:', apiUrl);

    await sendMessage(senderId, {
      attachment: {
        type: 'audio',
        payload: { url: apiUrl },
      },
    }, pageAccessToken);

  } catch (error) {
    console.error('Error generating voice message:', error);
    await sendError(senderId, 'Error generating voice message. Please try again or check your input.', pageAccessToken);
  }
};

// Centralized error handler for sending error messages
const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};
