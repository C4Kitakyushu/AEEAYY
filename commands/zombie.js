const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'zombie',
  description: 'transform an image into a zombie style.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗭𝗼𝗺𝗯𝗶𝗲" 𝘁𝗼 𝗮𝗽𝗽𝗹𝘆 𝘁𝗵𝗲 𝗲𝗳𝗳𝗲𝗰𝘁.`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗖𝗼𝗻𝘃𝗲𝗿𝘁𝗶𝗻𝗴 𝘁𝗼 𝗭𝗼𝗺𝗯𝗶𝗲 𝗦𝘁𝘆𝗹𝗲, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const zombieUrl = `https://kaiz-apis.gleeze.com/api/zombie?url=${encodeURIComponent(imageUrl)}`;

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: zombieUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error transforming image to zombie style:', error);
      await sendMessage(senderId, {
        text: '❌ An error occurred while processing the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};