const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'catimage',  // Command name
  description: 'random cat image',  // Description 
  usage: 'catimage',  // Usage
  author: 'developer',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    try {
      const response = await axios.get(`https://rest-api.joshuaapostol.site/cat-image`);
      const imageUrl = response.data.url; // Assuming the API response has a 'url' property

      // Notify user that the image is being generated
      await sendMessage(senderId, { text: 'Here is a random cat image for you!' }, pageAccessToken);

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
      console.error('Error fetching or sending the cat image:', error);
      
      // Notify user of the error
      await sendMessage(senderId, { text: 'An error occurred while fetching the cat image.' }, pageAccessToken);
    }
  }
};
