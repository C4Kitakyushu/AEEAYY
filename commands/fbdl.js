const axios = require('axios');

module.exports = {
  name: 'fbdl',
  description: 'Download Facebook video using video URL',
  author: 'Dale Mekumi',
  usage: 'fbvideo videoUrl',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const videoUrl = args.join(' ');
    if (!videoUrl) {
      return sendMessage(senderId, { text: "❌ Please provide a Facebook video URL." }, pageAccessToken);
    }

    try {
      sendMessage(senderId, { text: "⌛ Downloading video, please wait..." }, pageAccessToken);

      const response = await axios.get(`https://api.kenliejugarap.com/fbdl/?videoUrl=${encodeURIComponent(videoUrl)}`);
      const downloadUrl = response.data.downloadUrl;

      if (!downloadUrl) {
        return sendMessage(senderId, { text: "❌ Unable to retrieve the video. Please check the URL and try again." }, pageAccessToken);
      }

      const videoMessage = {
        attachment: {
          type: 'video',
          payload: {
            url: downloadUrl,
          },
        },
      };

      await sendMessage(senderId, videoMessage, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};
