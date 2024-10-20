const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage'); // Assume this sends messages to users

module.exports = {
  name: 'art',
  description: 'generates an art based on a prompt',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    // Check if arguments are provided
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    // Combine the args into a prompt string
    const prompt = args.join(' ');

    try {
      // Encode the prompt and prepare the API URL
      const apiUrl = `https://ccprojectsjonellapis-production.up.railway.app/api/generate-art?prompt=${encodeURIComponent(prompt)}`;
      
      // Make the request to the API
      const response = await axios.get(apiUrl);

      // Check if the response is successful
      if (response.status === 200 && response.data.imageUrl) {
        // Send the generated image URL to the user
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: response.data.imageUrl
            }
          }
        }, pageAccessToken);
      } else {
        // If response doesn't have imageUrl or failed, send an error message
        await sendMessage(senderId, { text: 'Failed to generate image. Please try again.' }, pageAccessToken);
      }

    } catch (error) {
      // Log error for debugging
      console.error('Error generating image:', error);

      // Send a failure message to the user
      await sendMessage(senderId, { text: 'Error occurred while generating the image.' }, pageAccessToken);
    }
  }
};
