const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'upscale',
  description: 'upscale an image.',
  author: 'Harith',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝘂𝗽𝘀𝗰𝗮𝗹𝗲" 𝘁𝗼 𝗶𝗻𝗰𝗿𝗲𝗮𝘀𝗲 𝗶𝘁𝘀 𝗿𝗲𝘀𝗼𝗹𝘂𝘁𝗶𝗼𝗻.`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗨𝗽𝘀𝗰𝗮𝗹𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

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
      console.error('Error upscaling image:', error);
      await sendMessage(senderId, {
        text: 'An error occurred while processing the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
