const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'upsc',
  description: 'Enhance image quality using AI.',
  author: 'Rized',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗿𝗲𝗺𝗶𝗻𝗶" 𝘁𝗼 𝗲𝗻𝗵𝗮𝗻𝗰𝗲 𝗶𝘁.`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗘𝗻𝗵𝗮𝗻𝗰𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const upscaleUrl = `https://ccprojectapis.ddns.net/api/upscale?url=${encodeURIComponent(imageUrl)}`;

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: upscaleUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error enhancing image:', error);
      await sendMessage(senderId, {
        text: 'An error occurred while enhancing the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
