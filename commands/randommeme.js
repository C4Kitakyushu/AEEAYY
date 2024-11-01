const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'randommeme',  // Command name
  description: 'random meme',  // Description 
  usage: '[randommeme',  // Usage
  author: 'developer',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    try {
      const response = await axios.get(`https://rest-api.joshuaapostol.site/random-meme`);
      const memeUrl = response.data.url; // Assuming the API response has a 'url' property

      // Notify user that the meme is being generated
      await sendMessage(senderId, { text: 'Here is a random meme for you!' }, pageAccessToken);

      // Send the generated meme to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: memeUrl  // URL of the meme to be sent
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during meme fetching or sending
      console.error('Error fetching or sending the meme:', error);
      
      // Notify user of the error
      await sendMessage(senderId, { text: 'An error occurred while fetching the meme.' }, pageAccessToken);
    }
  }
};
