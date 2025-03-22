const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'removebg',
  description: 'Upscale an image using AI.',
  author: 'YourName',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝘂𝗽𝘀𝗰𝗮𝗹𝗲" 𝘁𝗼 𝗲𝗻𝗹𝗮𝗿𝗴𝗲 𝗶𝘁.`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗨𝗽𝘀𝗰𝗮𝗹𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const upscaleUrl = `https://kaiz-apis.gleeze.com/api/upscale?imageUrl=${encodeURIComponent(imageUrl)}`;

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: upscaleUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error upscaling image:', error);
      await sendMessage(senderId, {
        text: 'An error occurred while processing the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};