const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

// Read the token once at the top level
const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Fetch Facebook UID from a given profile link.',
  role: 1,
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    if (!Array.isArray(args) || args.length === 0) {
      return await sendError(senderId, 'Usage: fbuid [Facebook profile URL]', pageAccessToken);
    }

    const profileUrl = args.join(' ').trim();
    await handleFetchFacebookUid(senderId, profileUrl, pageAccessToken);
  },
};

// Function to retrieve Facebook UID from profile URL
const handleFetchFacebookUid = async (senderId, profileUrl, pageAccessToken) => {
  try {
    const res = await axios.get('https://kaiz-apis.gleeze.com/api/fbuid', {
      params: { url: profileUrl },
    });

    const { UID } = res.data;

    if (UID) {
      await sendMessage(senderId, {
        text: `✔ Facebook UID for the given profile:\n\nUID: ${UID}`,
      }, pageAccessToken);
    } else {
      throw new Error('Unable to retrieve Facebook UID');
    }
  } catch (error) {
    console.error('Error retrieving Facebook UID:', error);
    await sendError(senderId, 'Error retrieving Facebook UID. Please try again or check your input.', pageAccessToken);
  }
};

// Centralized error handler for sending error messages
const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};