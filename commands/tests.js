const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'tests',
  description: 'Interact with Lily AI',
  usage: 'lily [your message]',
  author: 'coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const input = (args.join(' ') || 'hello').trim();
    await handleChatResponse(senderId, input, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const systemRole = 'You are Lily AI, a helpful and friendly assistant.';
  const prompt = `${systemRole}\n${input}`;
  const apiUrl = `http://sgp1.hmvhostings.com:25743/lily?q=${encodeURIComponent(prompt)}&uid=${senderId}`;

  try {
    const { data: { response } } = await axios.get(apiUrl);

    const parts = [];
    for (let i = 0; i < response.length; i += 1999) {
      parts.push(response.substring(i, i + 1999));
    }

    for (const part of parts) {
      const formattedMessage = `${part}`;
      await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
    }
  } catch (error) {
    console.error('Error reaching the API:', error);
    await sendError(senderId, 'An error occurred while trying to reach the API.', pageAccessToken);
  }
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const formattedMessage = `${errorMessage}`;
  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};