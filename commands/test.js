const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Upscale an image to higher resolution using version 2 of the API',
  author: 'Rized',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: '❌ Please reply to an image to upscale it!'
      }, pageAccessToken);
    }

    await sendMessage(senderId, {
      text: '🔼 Upscaling the image (v2), please wait...'
    }, pageAccessToken);

    const apiUrl = `https://kaiz-apis.gleeze.com/api/upscale-v2?url=${encodeURIComponent(imageUrl)}`;

    try {
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const imageBase64 = `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`;

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: imageBase64
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error during upscaling (v2):', error);
      await sendMessage(senderId, {
        text: '❌ An error occurred while processing your request. Please try again later.'
      }, pageAccessToken);
    }
  }
};