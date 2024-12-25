const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'zombie',
  description: 'Transform an image into a zombie-themed version.',
  author: 'Developer',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: '❌ Please send an image and then type "zombie" to transform it into a zombie version!',
      }, pageAccessToken);
    }

    await sendMessage(senderId, {
      text: '🧟 Transforming the image into a zombie version, please wait...',
    }, pageAccessToken);

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/zombie-v2?imageUrl=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const base64Image = Buffer.from(response.data).toString('base64');

      if (!base64Image) {
        throw new Error('❌ Zombie transformation failed. No image received.');
      }

      await sendMessage(senderId, {
        text: '🧟‍♂️ Here is your zombie transformation!',
        attachments: [
          {
            type: 'image',
            payload: {
              is_reusable: true,
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error during zombie transformation:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while transforming the image. Please try again later.',
      }, pageAccessToken);
    }
  },
};