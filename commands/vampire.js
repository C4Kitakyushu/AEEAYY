const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'vampire',
  description: 'transform an image into a vampire version.',
  author: 'dev',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝘃𝗮𝗺𝗽𝗶𝗿𝗲" 𝘁𝗼 𝗮𝗽𝗽𝗹𝘆 𝘁𝗵𝗲 𝗲𝗳𝗳𝗲𝗰𝘁.`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗔𝗽𝗽𝗹𝘆𝗶𝗻𝗴 𝘃𝗮𝗺𝗽𝗶𝗿𝗲 𝗲𝗳𝗳𝗲𝗰𝘁, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const vampireUrl = `https://kaiz-apis.gleeze.com/api/vampire?imageUrl=${encodeURIComponent(imageUrl)}`;

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: vampireUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error applying vampire effect:', error);
      await sendMessage(senderId, {
        text: '❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗶𝗺𝗮𝗴𝗲. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.'
      }, pageAccessToken);
    }
  }
};