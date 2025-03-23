const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Search for images using Brave search.',
  usage: 'Braveimage <search-term> <limit>',
  author: 'developer',

  execute: async (senderId, args) => {
    const pageAccessToken = token;

    // Validate user input
    if (!args[0]) {
      return sendError(senderId, 'Please provide a search term (e.g., Braveimage cat 5).', pageAccessToken);
    }

    const searchQuery = args[0];
    const limit = args[1] || 5; // Default limit is 5 if not provided by the user
    const apiUrl = `https://kaiz-apis.gleeze.com/api/brave-image?search=${encodeURIComponent(searchQuery)}&limit=${limit}`;

    try {
      const { data } = await axios.get(apiUrl);

      if (data.imageUrls && data.imageUrls.length > 0) {
        const imageMessages = data.imageUrls.map((url) => ({
          attachment: {
            type: 'image',
            payload: { url },
          },
        }));

        for (const message of imageMessages) {
          await sendMessage(senderId, message, pageAccessToken);
        }
      } else {
        sendError(senderId, '❌ Error: No images found for your search.', pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching Brave images:', error);
      sendError(senderId, '❌ Error: Unexpected error occurred.', pageAccessToken);
    }
  },
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};