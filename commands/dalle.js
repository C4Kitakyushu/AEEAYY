const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'dalle',  // Command name
  description: 'generates an image based on the given prompt',  // description
  usage: 'generateImage <prompt>',  // usage
  author: 'Ali',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: 'Please provide a prompt to generate an image.'
      }, pageAccessToken);
      return;  // Exit the function if no prompt is provided
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://markdevs-last-api-2epw.onrender.com/dallev2?prompt=${encodeURIComponent(prompt)}`;  // API endpoint with the prompt

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating image... Please wait.' }, pageAccessToken);

    try {
      // Send the request to the API
      const response = await axios.get(apiUrl);

      // Check if the response contains the generated image URL
      if (response.data && response.data.imageUrl) {
        // Send the generated image to the user as an attachment
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: response.data.imageUrl  // URL of the generated image
            }
          }
        }, pageAccessToken);
      } else {
        // Notify user if the image generation failed
        await sendMessage(senderId, {
          text: 'Failed to generate image. Please try again later.'
        }, pageAccessToken);
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
