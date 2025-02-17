const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai',
  description: 'Chat with GPT-4',
  usage: 'ai <your message>',
  author: 'develoepr',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const input = (args.join(' ') || 'hello').trim();
    await handleChatResponse(senderId, input, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const systemRole = 'you are Hershey AI. an AI assistant.';
  const prompt = `${systemRole}\n${input}`;
  const apiUrl = `https://api.zetsu.xyz/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${senderId}`;

  try {
    const { data } = await axios.get(apiUrl);
    const responseText = data.gpt4 || 'No response from the API.';
    const formattedMessage = `${responseText}`;

    await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
  } catch (error) {
    console.error('Error reaching the API:', error);
    await sendError(senderId, 'An error occurred while trying to reach the API.', pageAccessToken);
  }
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const formattedMessage = `${errorMessage}`;
  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};