const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'shoti',
  description: 'Fetch a random TikTok Shoti video.',
  usage: 'Shoti',
  author: 'developer',

  execute: async (senderId) => {
    const pageAccessToken = token;
    const apiUrl = 'https://kaiz-apis.gleeze.com/api/shoti';

    try {
      const { data } = await axios.get(apiUrl);

      if (data.status === 'success' && data.shoti) {
        const { videoUrl, username, nickname, duration, region } = data.shoti;

        const videoMessage = {
          attachment: {
            type: 'video',
            payload: {
              url: videoUrl,
            },
          },
        };

        
        await sendMessage(senderId, infoMessage, pageAccessToken);
      } else {
        sendError(senderId, '❌ Error: Unable to fetch Shoti video.', pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching Shoti video:', error);
      sendError(senderId, '❌ Error: Unexpected error occurred.', pageAccessToken);
    }
  },
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};