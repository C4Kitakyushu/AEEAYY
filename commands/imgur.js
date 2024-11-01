const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'imgur',
  description: 'upload to imgur link .',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: 'No attachment detected. Please send an image or video first.'
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗨𝗽𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝘁𝗵𝗲 𝗶𝗺𝗮𝗴𝗲 𝘁𝗼 𝗶𝗺𝗴𝘂𝗿 𝗹𝗶𝗻𝗸 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`);
      const imgurLink = response?.data?.uploaded?.image;

      if (!imgurLink) {
        throw new Error('❌ Imgur link not found in the response');
      }

      await sendMessage(senderId, {
        text: `𝗜𝗺𝗴𝘂𝗿 𝘂𝗽𝗹𝗼𝗮𝗱𝗲𝗱 :\n\n🔗: ${imgurLink}`
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error uploading image to Imgur:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while uploading the image to Imgur. Please try again later.'
      }, pageAccessToken);
    }
  }
};