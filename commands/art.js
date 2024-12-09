const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'art', // Command name
  description: 'generate art based on the provided prompt.', // Description
  usage: 'generateart <prompt>', // Usage
  author: 'Co', // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: '❌ Please provide a prompt to generate an image.'
      }, pageAccessToken);
      return; // Exit the function if no prompt is provided
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://api.joshweb.click/api/art?prompt=${encodeURIComponent(prompt)}`; // API endpoint with the prompt

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: '⌛ Generating image... Please wait.' }, pageAccessToken);

    try {
      // Request the image URL from the API
      const response = await axios.get(apiUrl);

      // Validate API response
      if (response.data && response.data.image) {
        const imageUrl = response.data.image; // Extract image URL from the API response

        // Send the generated image to the user as an attachment
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: imageUrl // URL of the generated image
            }
          }
        }, pageAccessToken);
      } else {
        throw new Error('Invalid API response.');
      }

    } catch (error) {
      // Handle and log any errors during image generation
      console.error('Error generating image:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'An error occurred while generating the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
