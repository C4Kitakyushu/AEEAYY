const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Generates an image based on a prompt using Flux Pro Replicate.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: '❌ Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/flux?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data.ok && response.data.data && response.data.data.imageUrl) {
        const imageUrl = response.data.data.imageUrl;

        // Send the generated image
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: { url: imageUrl }
          }
        }, pageAccessToken);
      } else {
        console.error('Error: Invalid API response or image not found.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};