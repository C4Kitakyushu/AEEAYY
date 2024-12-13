const axios = require('axios');
const { sendMessage, sendVideo } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Download and send Facebook videos',
  usage: '/fbdl <Facebook URL>',
  author: 'joshua Apostol',
  async execute(msg, bot, args) {
    if (!args || !args.trim()) {
      await sendMessage(msg.chat.id, 'Please provide a Facebook URL.');
      return;
    }

    const url = args.trim();
    const apiUrl = `https://api.joshweb.click/facebook?url=${encodeURIComponent(url)}`;

    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200 && response.data) {
        const videoUrl = response.data.result;
        if (videoUrl) {
          await sendVideo(msg.chat.id, videoUrl, bot);
        } else {
          await sendMessage(msg.chat.id, '❌ Error: Unable to find the video URL.', bot);
        }
      } else {
        await sendMessage(msg.chat.id, '❌ Error: Unable to fetch data from the API.', bot);
      }
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(msg.chat.id, `❌ Error: ${error.message}`, bot);
    }
  },
};
