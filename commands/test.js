const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'test',  // Command name
  description: 'Generate a waifu image.',  // Description
  usage: 'waifu <prompt>',  // Usage
  author: 'Ali',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: 'Please provide a prompt to generate a waifu image.'
      }, pageAccessToken);
      return;  // Exit the function if no prompt is provided
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://nash-api.onrender.com/api/waifu1?prompt=${encodeURIComponent(prompt)}`;  // API endpoint with the prompt

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating waifu image... Please wait.' }, pageAccessToken);

    try {
      // Send the generated image to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl  // URL of the generated image
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during image generation
      console.error('Error generating waifu image:', error);
      
      // Notify user of the error
      await sendMessage(senderId, {
        text: 'An error occurred while generating the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
