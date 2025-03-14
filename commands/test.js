const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs-extra');

module.exports = {
  name: 'test',
  description: 'Enhance image quality using the Upscale API.',
  author: 'Jonell Magallanes',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝘂𝗽𝘀𝗰𝗮𝗹𝗲" 𝘁𝗼 𝗶𝗺𝗽𝗿𝗼𝘃𝗲 𝗶𝘁𝘀 𝗾𝘂𝗮𝗹𝗶𝘁𝘆.`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗘𝗻𝗵𝗮𝗻𝗰𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲 𝗾𝘂𝗮𝗹𝗶𝘁𝘆, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const apiUrl = `https://hiroshi-api.onrender.com/image/upscale?url=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiUrl);

      if (response.data) {
        const processedImageURL = response.data;

        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: processedImageURL
            }
          }
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: '❎ | Failed to enhance the image. Please try again later.'
        }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error enhancing image:', error);
      await sendMessage(senderId, {
        text: '❎ | An error occurred while processing the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};