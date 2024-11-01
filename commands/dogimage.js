const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'dogimage',  // Command name
  description: 'random dog image',  // Description 
  usage: '[nashPrefix]dogimage',  // Usage
  author: 'developer',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    try {
      const response = await axios.get(`https://rest-api.joshuaapostol.site/random-dog-image`);
      const imageUrl = response.data.url;

      // Notify user that the image is being generated
      await sendMessage(senderId, { text: '🐶 𝗛𝗲𝗿𝗲 𝗶𝘀 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗱𝗼𝗴 𝗶𝗺𝗮𝗴𝗲 𝗳𝗼𝗿 𝘆𝗼𝘂!' }, pageAccessToken);

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
      console.error('❌ Error fetching or sending the dog image:', error);
      
      // Notify user of the error
      await sendMessage(senderId, { text: '❌ An error occurred while fetching the dog image.' }, pageAccessToken);
    }
  }
};
