const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'tiksearch',
  description: 'search for tiktok videos',
  usage: 'tiksearch <search text>',
  author: 'developer',

  execute: async (senderId, args) => {
    const pageAccessToken = token;
    const searchQuery = args.join(' ');
    if (!searchQuery) {
      return sendMessage(senderId, { text: 'Usage: tiksearch <search text>' }, pageAccessToken);
    }

    const apiUrl = `https://markdevs-last-api-vtjp.onrender.com/api/tiksearch?search=${encodeURIComponent(searchQuery)}`;

    try {
      const { data } = await axios.get(apiUrl);

      const videos = data.data.videos;

      if (!videos || videos.length === 0) {
        return sendMessage(senderId, { text: 'No videos found for the given search query.' }, pageAccessToken);
      }

      const videoData = videos[0];
      const videoUrl = videoData.play;

      const message = `📹 Tiksearch Result:\n\n👤 Post by: ${videoData.author.nickname}\n🔗 Username: ${videoData.author.unique_id}\n\n📝 Title: ${videoData.title}`;

      sendMessage(senderId, { text: message }, pageAccessToken);

      const videoMessage = {
        attachment: {
          type: 'video',
          payload: {
            url: videoUrl,
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
