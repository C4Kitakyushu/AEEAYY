const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Fetch a random hentai video.',
  usage: 'rand-hentai-video',
  author: 'Ali',

  execute: async (senderId) => {
    const pageAccessToken = token;
    const apiUrl = 'https://api.joshweb.click/api/randhntai';

    try {
      // Fetch data from the API
      const { data } = await axios.get(apiUrl);

      if (data.url) {
        const videoMessage = {
          attachment: {
            type: 'video',
            payload: { url: data.url } // URL for the video
          }
        };

        // Send the video as a message
        sendMessage(senderId, videoMessage, pageAccessToken);
      } else {
        sendError(senderId, 'Error: Unable to fetch video.', pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      sendError(senderId, 'Error: Unexpected error occurred.', pageAccessToken);
    }
  },
};

// Helper function to send error messages
const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};
