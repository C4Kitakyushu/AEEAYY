const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  name: 'fbcover',  // Command name
  description: 'Generates a Facebook cover image with the provided details',  // description 
  usage: '<name> <subname> <address> <email> <color>',  // usage
  author: 'Ali',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if all arguments are provided
    if (!args || args.length < 5) {
      // Send message requesting all required details if missing
      await sendMessage(senderId, {
        text: 'Please provide all details: name, subname, address, email, and color.'
      }, pageAccessToken);
      return;  // Exit the function if arguments are missing
    }

    // Extract arguments for the API request
    const [name, subname, address, email, color] = args;
    const apiUrl = `https://joshweb.click/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&uid=4&color=${encodeURIComponent(color)}`;

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating image... Please wait.' }, pageAccessToken);

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
      console.error('Error generating image:', error);
      
      // Notify user of the error
      await sendMessage(senderId, {
        text: 'An error occurred while generating the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
