const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai',
  description: 'starling gpt4 helper',
  usage: 'ai <your message>',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const input = (args.join(' ') || 'hello').trim();
    await handleChatResponse(senderId, input, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const systemRole = 'You Tr1pZzey AI, an AI assistant.';
  const prompt = `${systemRole}\n${input}`;
  const apiUrl = `https://api.joshweb.click/ai/starling-lm-7b?q=${encodeURIComponent(prompt)}&uid=${senderId}`;

  try {
    const { data } = await axios.get(apiUrl);
    const responseText = data.result || '☹️ No response from the API.';

    // Split the response into chunks if it exceeds 2000 characters
    const maxMessageLength = 2000;
    if (responseText.length > maxMessageLength) {
      const messages = splitMessageIntoChunks(responseText, maxMessageLength);
      for (const message of messages) {
        await sendMessage(senderId, { text: message }, pageAccessToken);
      }
    } else {
      await sendMessage(senderId, { text: responseText }, pageAccessToken);
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

const splitMessageIntoChunks = (message, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
};
