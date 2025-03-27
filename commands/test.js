const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Generate an image with Flux AI based on a prompt.',
  author: 'dev',

  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.\nUsage: /flux <prompt>' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://kaiz-apis.gleeze.com/api/flux`;

    try {
      // Send request to the Flux API
      const { data } = await axios.get(apiUrl, {
        responseType: 'stream',
        params: { prompt },
      });

      // Send the generated image
      await sendMessage(
        senderId,
        {
          text: `Here is your generated image for: "${prompt}"`,
          attachment: { type: 'image', payload: { url: data } },
        },
        pageAccessToken
      );
    } catch (error) {
      console.error('Error generating image:', error);
      await sendMessage(senderId, { text: 'Error: Could not generate image. Please try again later.' }, pageAccessToken);
    }
  },
};