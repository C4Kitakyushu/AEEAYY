const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'enhanceImage',
  description: 'Enhance image quality using the Remini API.',
  author: 'chi',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗲𝗻𝗵𝗮𝗻𝗰𝗲𝗶𝗺𝗮𝗴𝗲" 𝘁𝗼 𝗲𝗻𝗵𝗮𝗻𝗰𝗲 𝗶𝘁𝘀 𝗾𝘂𝗮𝗹𝗶𝘁𝘆.`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗘𝗻𝗵𝗮𝗻𝗰𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲 𝗾𝘂𝗮𝗹𝗶𝘁𝘆, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const enhanceImageUrl = `https://betadash-uploader.vercel.app/remini?url=${encodeURIComponent(imageUrl)}`;

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: enhanceImageUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error enhancing image:', error);
      await sendMessage(senderId, {
        text: 'An error occurred while processing the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
