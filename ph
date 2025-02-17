const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'pinayflix',
  description: 'search for video from pinayflix and send multiple',
  usage: 'pinaysearch <search title>',
  author: 'Rized',

  execute: async (senderId, args) => {
    const pageAccessToken = token;
    const searchQuery = args.join(' ');

    if (!searchQuery) {
      return sendMessage(senderId, { text: '❌ Usage: pinaysearch <title>' }, pageAccessToken);
    }

    const apiUrl = `http://sgp1.hmvhostings.com:25743/pinay?search=${encodeURIComponent(searchQuery)}&page=2`;

    try {
      const { data } = await axios.get(apiUrl);

      if (!data || data.length === 0) {
        return sendMessage(senderId, { text: '❌ No videos found for the given search query.' }, pageAccessToken);
      }

      // Build response messages for each video
      for (const video of data) {
        const message = `🎥 **Search Result** 🎥\n\n` +
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
      }

    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, { text: '❌ An error occurred while processing the request. Please try again later.' }, pageAccessToken);
    }
  },
};