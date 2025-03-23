const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Fetch a random image using the Random API.',
  usage: 'random',
  author: 'developer',

  execute: async (senderId) => {
    const pageAccessToken = token;
    const apiUrl = 'https://kaiz-apis.gleeze.com/api/random-jjk';

    try {
      const { data } = await axios.get(apiUrl);

      // Assuming the API returns a JSON with "status" and "randomUrl"
      if (data.status === 'success' && data.randomUrl) {
        const imageMessage = {
          attachment: {
            type: 'image',
            payload: { url: data.randomUrl }
          }
        };

        sendMessage(senderId, imageMessage, pageAccessToken);
      } else {
        sendError(senderId, 'Error: Unable to fetch random content.', pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching random content:', error);
      sendError(senderId, 'Error: Unexpected error occurred.', pageAccessToken);
    }
  },
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};