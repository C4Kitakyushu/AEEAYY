const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'fbcover',  // Command name
  description: 'Generate Facebook cover image',  // Description 
  usage: '[name | last name | phone number | country | email | color]',  // Usage
  author: 'Ali',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if all arguments are provided
    if (!args || args.length < 6) {
      // Send message requesting missing information
      await sendMessage(senderId, {
        text: 'Please provide your name, last name, phone number, country, email, and preferred color.'
      }, pageAccessToken);
      return;  // Exit the function if required information is missing
    }

    // Extract the arguments
    const [name, lastName, phoneNumber, country, email, color] = args;

    // Construct the API URL with query parameters
    const apiUrl = `https://joshweb.click/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(lastName)}&sdt=${encodeURIComponent(phoneNumber)}&address=${encodeURIComponent(country)}&email=${encodeURIComponent(email)}&uid=${encodeURIComponent(senderId)}&color=${encodeURIComponent(color)}`;

    // Notify the user that the image is being generated
    await sendMessage(senderId, { text: 'Generating your Facebook cover image... Please wait.' }, pageAccessToken);

    try {
      // Send the generated image to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl  // URL of the generated image from the API
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during the image generation
      console.error('Error generating the image:', error);

      // Notify the user about the error
      await sendMessage(senderId, {
        text: 'Sorry, there was an error generating your Facebook cover image.'
      }, pageAccessToken);
    }
  }
};
