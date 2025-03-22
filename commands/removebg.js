const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'removebg',
  description: 'Remove the background from an image.',
  author: 'Strawhat Luffy & kshitiz',
  async execute(senderId, args, pageAccessToken, imageUrl) {
    const apiKey = 'cdgvJYo22Tu3tSJqXhBLbWwk';

    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗿𝗲𝗺𝗼𝘃𝗲𝗯𝗴" 𝘁𝗼 𝗿𝗲𝗺𝗼𝘃𝗲 𝗶𝘁𝘀 𝗯𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱.`
      }, pageAccessToken);
    }

    await sendMessage(senderId, {
      text: '⌛ 𝗥𝗲𝗺𝗼𝘃𝗶𝗻𝗴 𝗯𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱 𝗳𝗿𝗼𝗺 𝘁𝗵𝗲 𝗶𝗺𝗮𝗴𝗲. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...'
    }, pageAccessToken);

    try {
      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        {
          image_url: imageUrl,
          size: 'auto',
        },
        {
          headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      const imageBuffer = Buffer.from(response.data, 'binary');

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            is_reusable: true,
            url: `data:image/png;base64,${imageBuffer.toString('base64')}`,
          },
        },
      }, pageAccessToken);

    } catch (error) {
      console.error('Error removing background:', error);
      await sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝗽𝗿𝗼𝗰𝗲𝘀𝘀 𝘁𝗵𝗲 𝗶𝗺𝗮𝗴𝗲. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.'
      }, pageAccessToken);
    }
  }
};