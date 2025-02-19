const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Search for YouTube videos and send multiple results',
  usage: 'ytsearch <search text>',
  author: 'Rized',

  execute: async (senderId, args) => {
    const pageAccessToken = token;
    const searchQuery = args.join(' ');

    if (!searchQuery) {
      return sendMessage(senderId, { text: 'Usage: ytsearch <search text>' }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/ytsearch?query=${encodeURIComponent(searchQuery)}`;

    try {
      const { data } = await axios.get(apiUrl);

      if (!data || !data.results || data.results.length === 0) {
        return sendMessage(senderId, { text: '❌ No videos found for the given search query.' }, pageAccessToken);
      }

      // Send multiple video results
      for (const video of data.results) {
        const message = `🎥 **YouTube Search Result** 🎥\n\n` +
          `**Title**: ${video.title}\n` +
          `🔗 **Link**: ${video.url}\n` +
          `🖼 **Thumbnail**: ${video.thumbnail}\n\n` +
          `Enjoy watching!`;

        // Send text message
        await sendMessage(senderId, { text: message }, pageAccessToken);

        // Send video message (if a direct video link is available)
        if (video.video_url) {
          const videoMessage = {
            attachment: {
              type: 'video',
              payload: {
                url: video.video_url,
                is_reusable: true
              }
            }
          };
          await sendMessage(senderId, videoMessage, pageAccessToken);
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, { text: 'An error occurred while processing the request. Please try again later.' }, pageAccessToken);
    }
  },
};