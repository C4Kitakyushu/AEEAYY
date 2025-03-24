const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'greyscale',
  description: 'apply a grey filter to an image.',
  author: 'dev',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(
        senderId,
        {
          text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗴𝗿𝗲𝘆𝘀𝗰𝗮𝗹𝗲" 𝘁𝗼 𝗮𝗽𝗽𝗹𝘆 𝗮 𝗴𝗿𝗲𝘆 𝗳𝗶𝗹𝘁𝗲𝗿.`
        },
        pageAccessToken
      );
    }

    await sendMessage(
      senderId,
      { text: '⌛ 𝗔𝗽𝗽𝗹𝘆𝗶𝗻𝗴 𝗴𝗿𝗲𝘆 𝗳𝗶𝗹𝘁𝗲𝗿, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' },
      pageAccessToken
    );

    try {
      const greyFilterUrl = `https://hazeyyyy-rest-apis.onrender.com/api/grey?image=${encodeURIComponent(
        imageUrl
      )}`;

      await sendMessage(
        senderId,
        {
          attachment: {
            type: 'image',
            payload: {
              url: greyFilterUrl
            }
          }
        },
        pageAccessToken
      );
    } catch (error) {
      console.error('Error applying grey filter:', error);
      await sendMessage(
        senderId,
        {
          text: '❌ An error occurred while processing the image. Please try again later.'
        },
        pageAccessToken
      );
    }
  }
};