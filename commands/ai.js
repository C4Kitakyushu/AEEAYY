const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

// Read token from file
const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai',
  description: 'Ask GPT-4o a question and get AI-powered responses',
  usage: 'gpt4o [question]',
  author: 'developer',

  execute: async (senderId, args) => {
    const pageAccessToken = token;

    // Validate input: Ensure the user provides a question
    if (!args.length) {
      return sendError(
        senderId,
        '🤖 Invalid format! Use the command like this:\n\ngpt4o [question]\nExample: gpt4o What is the capital of France?',
        pageAccessToken
      );
    }

    // Combine arguments into a single question
    const question = args.join(' ').trim();
    const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o?ask=${encodeURIComponent(
      question
    )}&uid=4&webSearch=off`;

    try {
      // Fetch data from the API
      const { data } = await axios.get(apiUrl);

      // Check if API response contains valid data
      if (data && data.reply) {
        await sendMessage(
          senderId,
          { text: `🤖 GPT-4o says:\n\n${data.reply}` },
          pageAccessToken
        );
      } else {
        await sendError(
          senderId,
          `❌ No valid response received for your query.`,
          pageAccessToken
        );
      }
    } catch (error) {
      console.error('Error fetching response from GPT-4o:', error);
      await sendError(
        senderId,
        '❌ An error occurred while communicating with GPT-4o. Please try again later.',
        pageAccessToken
      );
    }
  },
};

// Centralized error handler for sending error messages
const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};