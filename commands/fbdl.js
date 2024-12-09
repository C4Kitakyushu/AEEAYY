const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'fbdl',
  description: 'fbdl [Facebook video link]',
  usage: '-fbdl <link>',
  author: 'coffee',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Error: Missing URL!' }, pageAccessToken);
      return;
    }

    const videoUrl = args.join(' ');

    try {
      const apiUrl = `https://api.kenliejugarap.com/fbdl/?videoUrl=${encodeURIComponent(videoUrl)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.status === 'success' && response.data.downloadUrl) {
        await sendMessage(senderId, { attachment: { type: 'video', payload: { url: response.data.downloadUrl } } }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: 'Error: Unable to fetch video. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Unexpected error occurred.' }, pageAccessToken);
    }
  }
};
