const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'artv2',  // Command name
  description: 'generates art based on a prompt v2.',  // Description
  usage: '!generateArt <prompt>',  // Usage
  author: 'YourName',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: 'Please provide a prompt to generate art.'
      }, pageAccessToken);
      return;  // Exit the function if no prompt is provided
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://appjonellccapis.zapto.org/api/generate-art?prompt=${encodeURIComponent(prompt)}`;

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating image... Please wait.' }, pageAccessToken);

    try {
      // Make API request to generate art
      const response = await axios.get(apiUrl);

      // Check if the response contains an image URL
      if (response.data && response.data.image_url) {
        // Send the generated image to the user as an attachment
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: response.data.image_url  // URL of the generated image
            }
          }
        }, pageAccessToken);
      } else {
        // Notify user if there was an issue with image generation
        await sendMessage(senderId, {
          text: 'Sorry, there was an issue generating the image.'
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
