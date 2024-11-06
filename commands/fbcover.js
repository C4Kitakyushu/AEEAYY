const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'emogif',  // Command name
  description: 'Converts emoji to GIF.',  // Description
  usage: '<emoji>',  // Usage
  author: 'Ali',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting an emoji if missing
      await sendMessage(senderId, {
        text: 'Please provide an emoji to convert to a GIF.'
      }, pageAccessToken);
      return;  // Exit the function if no emoji is provided
    }

    // Concatenate arguments to form the emoji string
    const emoji = args.join(' ');
    const apiUrl = `https://joshweb.click/emoji2gif?q=${encodeURIComponent(emoji)}`;  // API endpoint with the emoji

    // Notify user that the GIF is being generated
    await sendMessage(senderId, { text: 'Generating GIF... Please wait.' }, pageAccessToken);

    try {
      // Fetch the GIF URL from the API
      const response = await axios.get(apiUrl);
      const gifUrl = response.data.url;  // Assuming the API returns the GIF URL in 'url' field

      // Send the generated GIF to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: gifUrl  // URL of the generated GIF
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during GIF generation
      console.error('Error generating GIF:', error);
      
      // Notify user of the error
      await sendMessage(senderId, {
        text: 'Sorry, there was an error generating the GIF. Please try again later.'
      }, pageAccessToken);
    }
  }
};
