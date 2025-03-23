const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Swap faces between two images.',
  author: 'dev',

  async execute(senderId, args, pageAccessToken, swapUrl, baseUrl) {
    if (!swapUrl || !baseUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝘁𝘄𝗼 𝗶𝗺𝗮𝗴𝗲 𝗨𝗥𝗟𝘀 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗳𝗮𝗰𝗲𝘀𝘄𝗮𝗽" 𝘄𝗶𝘁𝗵 𝗯𝗼𝘁𝗵 𝗨𝗥𝗟𝘀 𝗮𝘀 𝗽𝗮𝗿𝗮𝗺𝗲𝘁𝗲𝗿𝘀.`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗦𝘄𝗮𝗽𝗽𝗶𝗻𝗴 𝗳𝗮𝗰𝗲𝘀, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/faceswap?swapUrl=${encodeURIComponent(swapUrl)}&baseUrl=${encodeURIComponent(baseUrl)}`;

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error swapping faces:', error);
      await sendMessage(senderId, {
        text: '❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗳𝗮𝗰𝗲𝘀𝘄𝗮𝗽. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.'
      }, pageAccessToken);
    }
  }
};