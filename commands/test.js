const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

// Reading the page access token from 'token.txt'
const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test', // Updated name based on the API
  description: 'Summarize the provided text into a concise form', // Updated description
  usage: 'summarize [your text]', // Updated usage based on API functionality
  author: 'developer', // Author name

  // Main execution function for the command
  async execute(senderId, args) {
    const pageAccessToken = token;

    // Combine all arguments into a single text and use it as input
    const input = (args.join(' ') || 'test').trim();
    await handleSummarize(senderId, input, pageAccessToken);
  },
};

// Function to handle the summarizing logic
const handleSummarize = async (senderId, input, pageAccessToken) => {
  // Encode the input text and append it to the summarize API URL
  const apiUrl = `https://kaiz-apis.gleeze.com/api/summarize?text=${encodeURIComponent(input)}`;

  try {
    // Make a GET request to the API
    const { data: { response } } = await axios.get(apiUrl);

    // Send the summarized response to the user in manageable chunks
    await sendResponseInChunks(senderId, response, pageAccessToken);
  } catch (error) {
    console.error('Error calling Summarize API:', error);

    // Notify the user about the error
    await sendError(senderId, 'An error occurred while summarizing your text.', pageAccessToken);
  }
};

// Function to split and send the response text in chunks
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

// Function to split a message into smaller chunks
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

// Function to send an error message to the user
const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};
