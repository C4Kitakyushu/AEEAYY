const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'fluxdisney',
  description: 'generates an image using the flux disney api based on a prompt.',
  usage: '<prompt>',
  author: 'dev',

  async execute(senderId, args, pageAccessToken) {
    // Join the arguments to form the prompt
    const prompt = args.join(' ').trim();
    if (!prompt) {
      return sendMessage(senderId, { text: 'Please provide an image prompt.' }, pageAccessToken);
    }

    // Construct the API URL
    const apiUrl = `https://api.kenliejugarap.com/flux-disney/?prompt=${encodeURIComponent(prompt)}`;

    try {
      // Make the API call
      const response = await axios.get(apiUrl);

      // Validate the response structure
      if (response.data && response.data.status) {
        const imgUrl = response.data.response;

        // Send the generated image as a message
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: { url: imgUrl },
          },
        }, pageAccessToken);
      } else {
        // Handle cases where the API response indicates failure
        sendMessage(senderId, { text: 'Image generation failed. Please try again with a different prompt.' }, pageAccessToken);
      }
    } catch (error) {
      // Log and notify the user about the error
      console.error('Error generating image:', error.message || error);
      sendMessage(senderId, { text: 'An error occurred while generating the image. Please try again later.' }, pageAccessToken);
    }
  },
};
