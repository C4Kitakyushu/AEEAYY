const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'poliv2',
  description: 'Generates an image based on a text prompt',
  author: 'YourName',

  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: '❌ Please provide a prompt to generate an image\n\nExample: imagegen tree.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(" ");
    await sendMessage(senderId, { text: `⌛ Generating image for your prompt: "${prompt}", please wait...` }, pageAccessToken);

    try {
      const apiUrl = `https://appjonellccapis.zapto.org/api/imgen?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.url) {
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: response.data.url
            }
          }
        }, pageAccessToken);
      } else {
        throw new Error('Invalid response from the image generation API');
      }

    } catch (error) {
      console.error('Error generating image:', error);
      await sendMessage(senderId, { text: 'Sorry, there was an error generating the image.' }, pageAccessToken);
    }
  }
};
