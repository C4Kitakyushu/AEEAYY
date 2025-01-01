const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'tests',
  description: 'Search for videos using the Pinayflix API with pagination',
  usage: 'pinaysearch <search text> [page]',
  author: 'developer',

  execute: async (senderId, args) => {
    const pageAccessToken = token;
    if (args.length === 0) {
      return sendMessage(senderId, { text: 'Usage: pinaysearch <search text> [page]' }, pageAccessToken);
    }

    // Extract search query and optional `${page}`
    const searchQuery = args.slice(0, -1).join(' '); // Everything except the last argument
    const page = args[args.length - 1]; // Assume the last argument is `${page}`
    const apiUrl = `http://sgp1.hmvhostings.com:25743/pinay?search=${encodeURIComponent(searchQuery)}&page=${page}`;

    try {
      const { data } = await axios.get(apiUrl);

      if (!data || data.length === 0) {
        return sendMessage(senderId, { text: `No videos found for page ${page} and query "${searchQuery}".` }, pageAccessToken);
      }

      // Only use the first video from the results
      const video = data[0];

      const message = `🎥 **Search Result (Page ${page})** 🎥\n\n` +
        `**Title**: ${video.title}\n` +
        `🔗 **Link**: ${video.link}\n` +
        `🖼 **Preview Image**: ${video.img}\n\n` +
        `Enjoy watching!`;

      // Send text message
      await sendMessage(senderId, { text: message }, pageAccessToken);

      // Send video message
      const videoMessage = {
        attachment: {
          type: 'video',
          payload: {
            url: video.video,
            is_reusable: true
          }
        }
      };

      await sendMessage(senderId, videoMessage, pageAccessToken);

    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, { text: 'An error occurred while processing the request. Please try again later.' }, pageAccessToken);
    }
  },
};