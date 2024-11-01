const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'emojimix',  // Command name
  description: 'Mixes two emojis into one image.',  // description 
  usage: 'emojimix <emoji1> <emoji2>',  // usage
  author: 'Your Name',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if two emoji arguments are provided
    if (!args || args.length < 2) {
      // Send message requesting two emojis if missing
      await sendMessage(senderId, {
        text: 'Please provide two emojis to mix, like: emojimix 😀 😎'
      }, pageAccessToken);
      return;  // Exit the function if emojis are missing
    }

    // Get the two emojis from arguments
    const [emoji1, emoji2] = args;
    const apiUrl = `https://betadash-uploader.vercel.app/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating emoji mix... Please wait.' }, pageAccessToken);

    try {
      // Send the generated emoji mix to the user as an image attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl  // URL of the generated emoji mix image
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during emoji mix generation
      console.error('Error generating emoji mix:', error);
      
      // Notify user of the error
      await sendMessage(senderId, {
        text: 'Oops! Something went wrong while generating the emoji mix.'
      }, pageAccessToken);
    }
  }
};
