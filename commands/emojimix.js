const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export the module
module.exports = {
  name: 'emojimix', // Command name
  description: 'Combine two emojis into a new mix.',
  usage: 'emojimix emoji1 emoji2', // Usage of the command
  author: 'Ali', // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if at least two arguments (emoji1 and emoji2) are provided
    if (!args || args.length < 2) {
      await sendMessage(senderId, {
        text: '❌ Please provide two emojis to mix. Usage: emojimix emoji1 emoji2.'
      }, pageAccessToken);
      return; // Exit if insufficient arguments
    }

    // Extract emojis from arguments
    const emoji1 = encodeURIComponent(args[0]);
    const emoji2 = encodeURIComponent(args[1]);

    // Construct the API URL
    const apiUrl = `https://betadash-uploader.vercel.app/emojimix?emoji1=${emoji1}&emoji2=${emoji2}`;

    // Notify the user that the image is being generated
    await sendMessage(senderId, {
      text: '⌛ Generating mixed emoji... Please wait.'
    }, pageAccessToken);

    try {
      // Send the generated emoji mix as an image attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl // URL of the generated emoji mix
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log errors
      console.error('Error generating emoji mix:', error);

      // Notify the user of the error
      await sendMessage(senderId, {
        text: 'An error occurred while generating the emoji mix. Please try again later.'
      }, pageAccessToken);
    }
  }
};
