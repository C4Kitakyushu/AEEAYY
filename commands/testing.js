const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Generate an image using Flux Pro Replicate.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    // Validate input
    if (!prompt) {
      return sendMessage(senderId, {
        text: '❌ *Please provide a valid prompt!*\n\nUsage: `flux <PROMPT>`'
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/flux?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data.ok && response.data.data && response.data.data.imageUrl) {
        const imageUrl = response.data.data.imageUrl;

        // Send the generated image
        sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: imageUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);

        // Send additional confirmation
        sendMessage(senderId, {
          text: `✅ *Image generated successfully!*\n\n📋 *Prompt:* ${prompt}\n📤 *Image URL:* ${imageUrl}`
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: '❌ *Failed to generate image. Please try again later.*' }, pageAccessToken);
      }
    } catch (error) {
      console.error('❗ Error calling Flux API:', error?.response?.data || error);
      sendMessage(senderId, { text: '❌ An error occurred while processing your request.' }, pageAccessToken);
    }
  }
};