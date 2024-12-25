const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'imgbb', // Command name based on the API
  description: 'Upload an image to IMGBB and get the link.',
  author: 'Rized',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: '❌ No attachment detected. Please reply to an image to upload it to IMGBB!',
      }, pageAccessToken);
    }

    await sendMessage(senderId, {
      text: '🌐 Uploading the image to IMGBB, please wait...',
    }, pageAccessToken);

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/imgbb?url=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiUrl);
      const imgbbLink = response?.data?.link;

      if (!imgbbLink) {
        throw new Error('❌ IMGBB link not found in the response');
      }

      await sendMessage(senderId, {
        text: `✅ Image uploaded successfully!\n\n🌐 Link: ${imgbbLink}`,
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error uploading image to IMGBB:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while uploading the image to IMGBB. Please try again later.',
      }, pageAccessToken);
    }
  },
};