const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

let token = '';

if (fs.existsSync('token.txt')) {
  token = fs.readFileSync('token.txt', 'utf8').trim();
} else {
  console.error('Error: token.txt not found');
}

module.exports = {
  name: 'ai',
  description: 'Interact with AI assistant',
  usage: 'gpt4 [your message]',
  author: 'coffee',

  async execute(senderId, args) {
    if (!token) {
      console.error('Error: Token not found. Make sure token.txt exists.');
      await sendMessage(senderId, { text: 'Internal error: missing API token.' });
      return;
    }

    const input = args.length > 0 ? args.join(' ').trim() : 'hello';
    await handleChatResponse(senderId, input, token);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const systemRole = 'You are Tr1pZzey AI, a helpful and friendly assistant.';
  const prompt = `${systemRole}\n${input}`;
  const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=${senderId}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (!data || !data.response) {
      throw new Error('Invalid API response');
    }

    const response = data.response;
    const parts = [];
    
    for (let i = 0; i < response.length; i += 1999) {
      parts.push(response.substring(i, i + 1999));
    }

    for (const part of parts) {
      try {
        await sendMessage(senderId, { text: part }, pageAccessToken);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  } catch (error) {
    console.error('Error reaching the API:', error.message || error);
    await sendError(senderId, 'An error occurred while reaching the AI service.', pageAccessToken);
  }
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  try {
    await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
  } catch (err) {
    console.error('Error sending error message:', err);
  }
};