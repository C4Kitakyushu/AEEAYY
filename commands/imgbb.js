const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'imgbb',
  description: 'Upload an image to ImgBB and get the link.',
  author: 'Dale Mekumi',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: 'No attachment detected. Please send an image URL first.'
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ Uploading the image to ImgBB, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://kaiz-apis.gleeze.com/api/imgbb?url=${encodeURIComponent(imageUrl)}`);
      const imgbbLink = response?.data?.uploaded?.image;

      if (!imgbbLink) {
        throw new Error('❌ ImgBB link not found in the response.');
      }

      await sendMessage(senderId, {
        text: `ImgBB uploaded:\n\n🔗: ${imgbbLink}`
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error uploading image to ImgBB:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while uploading the image to ImgBB. Please try again later.'
      }, pageAccessToken);
    }
  }
};
