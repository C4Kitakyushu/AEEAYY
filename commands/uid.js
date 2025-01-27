const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

// Read the token once at the top level
const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'uid',
  description: 'fb uid retriever',
  role: 1,
  author: 'develoepr',

  async execute(senderId, args) {
    const pageAccessToken = token;

    if (!Array.isArray(args) || args.length === 0) {
      return await sendError(senderId, 'Usage: retrieve [Facebook profile URL]', pageAccessToken);
    }

    const profileUrl = args.join(' ').trim();
    await handleFindFacebookId(senderId, profileUrl, pageAccessToken);
  },
};

// Function to retrieve Facebook ID from profile URL
const handleFindFacebookId = async (senderId, profileUrl, pageAccessToken) => {
  try {
    const res = await axios.get('https://api.zetsu.xyz/api/findid', {
      params: { url: profileUrl },
    });

    const { status, result } = res.data;

    if (status && result) {
      await sendMessage(senderId, {
        text: `Facebook ID: ${result}`,
      }, pageAccessToken);
    } else {
      throw new Error('Unable to retrieve Facebook ID');
    }
  } catch (error) {
    console.error('Error retrieving Facebook ID:', error);
    await sendError(senderId, 'Error retrieving Facebook ID. Please try again or check your input.', pageAccessToken);
  }
};

// Centralized error handler for sending error messages
const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};
