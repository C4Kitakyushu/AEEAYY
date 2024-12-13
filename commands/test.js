const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Summarize your text into a concise version',
  usage: 'summarize [your text]',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const input = (args.join(' ') || 'test').trim();
    await handleSummarize(senderId, input, pageAccessToken);
  },
};

const handleSummarize = async (senderId, input, pageAccessToken) => {
  const apiUrl = `https://kaiz-apis.gleeze.com/api/summarize?text=${encodeURIComponent(input)}`;

  try {
    const { data: { response } } = await axios.get(apiUrl);

    await sendResponseInChunks(senderId, response, pageAccessToken);
  } catch (error) {
    console.error('Error calling Summarize API:', error);
    await sendError(senderId, 'An error occurred while summarizing your text.', pageAccessToken);
  }
};

const sendResponseInChunks = async (senderId, text, pageAccessToken) => {
  const maxMessageLength = 2000;
  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
};

const splitMessageIntoChunks = (message, chunkSize) => {
  const chunks = [];
  let chunk = '';
  const words = message.split(' ');

  for (const word of words) {
    if ((chunk + word).length > chunkSize) {
      chunks.push(chunk.trim());
      chunk = '';
    }
    chunk += `${word} `;
  }

  if (chunk) {
    chunks.push(chunk.trim());
  }

  return chunks;
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};
