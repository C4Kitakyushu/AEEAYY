const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'poli',
  description: 'Generates an image based on a text prompt',
  author: 'YourName',

  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt to generate an image.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    await sendMessage(senderId, { text: `Generating image for: "${prompt}"...` }, pageAccessToken);

    try {
      const apiUrl = `https://appjonellccapis.zapto.org/api/imgen?prompt=${encodeURIComponent(prompt)}`;

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
