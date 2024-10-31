const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'ss',  // Command name
  description: 'Take a screenshot of a website',  // Description
  usage: '/ss [url]',  // Usage
  author: 'Your Name',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if URL argument is provided
    if (!args || args.length === 0) {
      // Send message requesting a URL if missing
      await sendMessage(senderId, {
        text: '❌ Please provide a URL to screenshot.\n\nExample: ss https://example.com'
      }, pageAccessToken);
      return;  // Exit the function if no URL is provided
    }

    const url = args[0];
    const apiUrl = `https://rest-api.joshuaapostol.site/screenshot?url=${encodeURIComponent(url)}`;

    // Notify user that the screenshot is being taken
    await sendMessage(senderId, { text: '⌛ Taking a screenshot, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.screenshotURL) {
        throw new Error('Failed to retrieve screenshot URL.');
      }

      const imageUrl = data.screenshotURL;

      // Send the screenshot image to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl  // URL of the screenshot image
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during screenshot generation
      console.error('Error taking screenshot:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: `An error occurred: ${error.message}`
      }, pageAccessToken);
    }
  }
};
