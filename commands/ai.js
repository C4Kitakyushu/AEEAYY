const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'gpt4',
  description: 'Interact with GPT-4o',
  usage: 'gpt4 [your message]',
  author: 'coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const input = (args.join(' ') || 'hello').trim();
    await handleChatResponse(senderId, input, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const systemRole = 'You are Tr1pZzey AI, a helpful and friendly assistant.';
  const prompt = `${systemRole}\n${input}`;
  const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=${senderId}`;

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
