const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'screenshot',  // Command name
  description: 'take a screenshot of a website',  // Description
  usage: '/ss [url]',  // Usage
  author: 'Your Name',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if URL argument is provided
    if (!args || args.length === 0) {
      // Send message requesting a URL if missing
      await sendMessage(senderId, {
        text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗨𝗥𝗟 𝘁𝗼 𝘀𝗰𝗿𝗲𝗲𝗻𝘀𝗵𝗼𝘁.\n\nExample: ss https://example.com'
      }, pageAccessToken);
      return;  // Exit the function if no URL is provided
    }

    const url = args[0];
    const apiUrl = `https://rest-api.joshuaapostol.site/screenshot?url=${encodeURIComponent(url)}`;

    // Notify user that the screenshot is being taken
    await sendMessage(senderId, { text: '⌛ 𝗧𝗮𝗸𝗶𝗻𝗴 𝗮 𝘀𝗰𝗿𝗲𝗲𝗻𝘀𝗵𝗼𝘁, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.screenshotURL) {
        throw new Error('❌ Failed to retrieve screenshot URL.');
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
      console.error('❌ Error taking screenshot:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: `❌ An error occurred: ${error.message}`
      }, pageAccessToken);
    }
  }
};
