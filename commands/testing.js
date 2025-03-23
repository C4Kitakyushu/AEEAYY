const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Fetch a random TikTok random-jjk video.',
  usage: 'Shoti',
  author: 'developer',

  execute: async (senderId) => {
    const pageAccessToken = token;
    const apiUrl = 'https://kaiz-apis.gleeze.com/api/random-jjk';

    try {
      const { data } = await axios.get(apiUrl);

      if (data.status === 'success' && data.random-jjk) {
        const { videoUrl } = data.random-jjk;

        const videoMessage = {
          attachment: {
            type: 'video',
            payload: {
              url: videoUrl,
            },
          },
        };

        await sendMessage(senderId, videoMessage, pageAccessToken);
      } else {
        sendError(senderId, '❌ Error: Unable to fetch Random-jjk video.', pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching Random-jjk video:', error);
      sendError(senderId, '❌ Error: Unexpected error occurred.', pageAccessToken);
    }
  },
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};