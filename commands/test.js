const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Fetch a random hentai video with details.',
  usage: 'rand-hentai-video',
  author: 'Ali',

  execute: async (senderId) => {
    const pageAccessToken = token;
    const apiUrl = 'https://api.joshweb.click/api/randhntai';

    try {
      // Fetch data from the API
      const { data } = await axios.get(apiUrl);

      if (data && data.result && data.result.length > 0) {
        // Select the first video from the result
        const video = data.result[0];

        // Prepare a message with the video details
        const videoMessage = {
          text: `**Title:** ${video.title}\n**Category:** ${video.category}\n**Views:** ${video.views_count}\n**Shares:** ${video.share_count}\n**Link:** ${video.link}`,
        };

        // Send the details message
        await sendMessage(senderId, videoMessage, pageAccessToken);

        // Send the video
        const videoAttachment = {
          attachment: {
            type: 'video',
            payload: { url: video.video_1 }, // Use the first video URL
          },
        };
        await sendMessage(senderId, videoAttachment, pageAccessToken);
      } else {
        sendError(senderId, 'Error: No videos found in the API response.', pageAccessToken);
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
