const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'zombie', // Command name
  description: 'Transform an image into a zombie-themed version.',
  author: 'Developer',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: '❌ Please send an image first, then type "zombie" to transform it into a zombie version!',
      }, pageAccessToken);
    }

    await sendMessage(senderId, {
      text: '🧟 Transforming the image into a zombie version, please wait...',
    }, pageAccessToken);

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/zombie-v2?imageUrl=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiUrl);
      const zombieImageUrl = response?.data?.url;

      if (!zombieImageUrl) {
        throw new Error('❌ Zombie transformation failed. No image URL returned.');
      }

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: zombieImageUrl,
          },
        },
        text: '🧟‍♂️ Here is your zombie transformation!',
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error transforming image to zombie:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while processing the image. Please try again later.',
      }, pageAccessToken);
    }
  },
};