const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'generate an image using the SD model based on a prompt.',
  usage: 'sd <prompt>',
  author: 'redwan',

  execute: async (senderId, args) => {
    const pageAccessToken = token;

    // Validate user input
    if (!args[0]) {
      return sendError(senderId, '❌ Error: Please provide a prompt for the image generation (e.g., sd sunset).', pageAccessToken);
    }

    const prompt = args.join(' ');
    const apiUrl = `https://global-redwans-apis.onrender.com/api/sd?prompt=${encodeURIComponent(prompt)}`;

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: '🔄 Generating your image, please wait...' }, pageAccessToken);

    try {
      const { data } = await axios.get(apiUrl, { responseType: 'json' });

      // Validate response payload
      if (!data || !data.imageUrl) {
        return sendError(senderId, '❌ Error: Failed to generate an image. Please try again.', pageAccessToken);
      }

      // Send the generated image using its URL payload
      await sendMessage(
        senderId,
        {
          attachment: {
            type: 'image',
            payload: { url: data.imageUrl },
          },
        },
        pageAccessToken
      );
    } catch (error) {
      console.error('Error generating image:', error);
      sendError(senderId, '❌ Error: An error occurred while generating the image. Please try again later.', pageAccessToken);
    }
  },
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};