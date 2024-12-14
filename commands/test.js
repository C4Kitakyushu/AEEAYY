const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'test',  // Command name
  description: 'random waifu image',  // Description
  usage: 'waifu',  // Usage
  author: 'developer',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    try {
      const response = await axios.get('https://nash-api.onrender.com/api/waifu1');
      const imageUrl = response.data.url; // Assuming the API response has a 'url' property

      // Notify user that the image is being generated
      await sendMessage(senderId, { text: '🌸 𝗛𝗲𝗿𝗲 𝗶𝘀 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝘄𝗮𝗶𝗳𝘂 𝗶𝗺𝗮𝗴𝗲 𝗳𝗼𝗿 𝘆𝗼𝘂!' }, pageAccessToken);

      // Send the generated image to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl  // URL of the image to be sent
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during image fetching or sending
      console.error('❌ Error fetching or sending the waifu image:', error);

      // Notify user of the error
      await sendMessage(senderId, { text: '❌ An error occurred while fetching the waifu image.' }, pageAccessToken);
    }
  }
};
