const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Fetch a Facebook profile picture using UID.',
  author: 'Developer',

  async execute(senderId, args, pageAccessToken) {
    // Check if UID is provided
    if (!args || args.length === 0) {
      return sendMessage(
        senderId,
        {
          text: '𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗨𝗜𝗗 𝘁𝗼 𝗴𝗲𝘁 𝗮 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝘁𝘂𝗿𝗲.',
        },
        pageAccessToken
      );
    }

    const uid = args[0];

    await sendMessage(
      senderId,
      { text: '⌛ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝘁𝘂𝗿𝗲, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' },
      pageAccessToken
    );

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/facebookpfp?uid=${encodeURIComponent(uid)}`;
      
      // Send profile picture as an image attachment
      await sendMessage(
        senderId,
        {
          attachment: {
            type: 'image',
            payload: {
              url: apiUrl,
            },
          },
        },
        pageAccessToken
      );
    } catch (error) {
      console.error('Error fetching Facebook profile picture:', error);
      await sendMessage(
        senderId,
        {
          text: '𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝘁𝗵𝗲 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝘁𝘂𝗿𝗲. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.',
        },
        pageAccessToken
      );
    }
  },
};