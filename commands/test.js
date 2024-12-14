const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'test', // Command name
  description: 'Random waifu image', // Description
  usage: 'waifu', // Usage
  author: 'developer', // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    try {
      // Fetch the waifu image from the API
      const response = await axios.get('https://nash-api.onrender.com/api/waifu1');
      const imageUrl = response.data.url; // Assuming the API response has a 'url' property

      if (!imageUrl) {
        // If the API did not return a URL, notify the user
        await sendMessage(senderId, { text: '❌ No image received from the API.' }, pageAccessToken);
        return;
      }

      // Notify the user with a stylistic message
      await sendMessage(senderId, {
        text: '✨ 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐫𝐚𝐧𝐝𝐨𝐦 𝐰𝐚𝐢𝐟𝐮 𝐢𝐦𝐚𝐠𝐞! ✨',
      }, pageAccessToken);

      // Send the waifu image as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl, // URL of the image to be sent
            is_reusable: true, // Optional: makes the image reusable
          },
        },
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors
      console.error('❌ Error fetching or sending the waifu image:', error.response?.data || error.message);

      // Notify user of the error
      await sendMessage(senderId, { text: '❌ An error occurred while fetching the waifu image.' }, pageAccessToken);
    }
  },
};
