const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Fetch a random Pogi Sigena meme video.',
  usage: 'Pogisigena',
  author: 'developer',

  execute: async (senderId) => {
    const pageAccessToken = token;
    const apiUrl = 'https://kaiz-apis.gleeze.com/api/pogisigena';

    try {
      const { data } = await axios.get(apiUrl);

      if (data.videoUrl) {
        const videoMessage = {
          attachment: {
            type: 'video',
            payload: {
              url: data.videoUrl,
            },
          },
        };

        await sendMessage(senderId, videoMessage, pageAccessToken);
      } else {
        sendError(senderId, '❌ Error: Unable to fetch Pogi Sigena video.', pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching Pogi Sigena video:', error);
      sendError(senderId, '❌ Error: Unexpected error occurred.', pageAccessToken);
    }
  },
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};