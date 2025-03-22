const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Generate an art image based on the provided prompt.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for generating art.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://elevnnnx-rest-api.onrender.com/api/art?prompt=${encodeURIComponent(prompt)}`;

    try {
      // Make the API request
      const response = await axios.get(apiUrl);

      if (response.data && response.data.imageUrl) {
        // Send the image as a response
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: response.data.imageUrl,
              is_reusable: true,
            },
          },
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: 'Could not fetch the art image. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching art image:', error.message);
      await sendMessage(senderId, { text: 'An error occurred while generating the art. Please try again later.' }, pageAccessToken);
    }
  },
};