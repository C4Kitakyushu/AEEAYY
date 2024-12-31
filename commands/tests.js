const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'tests',
  description: 'Search for videos using the Pinayflix API',
  usage: 'pinaysearch <search text>',
  author: 'developer',

  execute: async (senderId, args) => {
    const pageAccessToken = token;
    const searchQuery = args.join(' ');
    if (!searchQuery) {
      return sendMessage(senderId, { text: 'Usage: pinaysearch <search text>' }, pageAccessToken);
    }

    const apiUrl = `http://sgp1.hmvhostings.com:25743/pinay?search=${encodeURIComponent(searchQuery)}&page=2`;

    try {
      const { data } = await axios.get(apiUrl);

      if (!data || data.length === 0) {
        return sendMessage(senderId, { text: 'No videos found for the given search query.' }, pageAccessToken);
      }

      const videoData = data[0]; // Get the first video as a sample
      const message = `🎥 **Search Result** 🎥\n\n` +
        `**Title**: ${videoData.title}\n` +
        `🔗 **Link**: ${videoData.link}\n` +
        `📄 **Preview**: ${videoData.img}\n\n` +
        `Enjoy watching!`;

      sendMessage(senderId, { text: message }, pageAccessToken);

      const videoMessage = {
        attachment: {
          type: 'video',
          payload: {
            url: videoData.video,
            is_reusable: true
          }
        }
      };

      sendMessage(senderId, videoMessage, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'An error occurred while processing the request.' }, pageAccessToken);
    }
  },
};