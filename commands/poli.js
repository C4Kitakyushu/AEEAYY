const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'poli',
  description: 'gnerates an image based on a text prompt',
  author: 'YourName',

  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt to generate an image.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    await sendMessage(senderId, { text: `⌛ 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲 𝗳𝗼𝗿 𝘆𝗼𝘂𝗿 𝗽𝗿𝗼𝗺𝗽𝘁:"${prompt}" 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁..` }, pageAccessToken);

    try {
      const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error generating image:', error);
      await sendMessage(senderId, { text: 'Sorry, there was an error generating the image.' }, pageAccessToken);
    }
  }
};
