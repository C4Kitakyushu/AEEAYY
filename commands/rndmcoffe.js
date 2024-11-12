const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'randomcoffee',  // Command name
  description: 'random coffee image',  // Description 
  usage: '[randomcoffee',  // Usage
  author: 'developer',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    try {
      const response = await axios.get(`https://apis-markdevs69v2.onrender.com/api/randomgambar/coffee`);
      const coffeeImageUrl = response.data.url; // Assuming the API response has a 'url' property

      // Notify user that the coffee image is being generated with font styling
      await sendMessage(senderId, { 
        text: '☕ 𝗛𝗲𝗿𝗲 𝗶𝘀 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗰𝗼𝗳𝗳𝗲𝗲 𝗶𝗺𝗮𝗴𝗲 𝗳𝗼𝗿 𝘆𝗼𝘂! ☕' 
      }, pageAccessToken);

      // Send the generated coffee image to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: coffeeImageUrl  // URL of the coffee image to be sent
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during image fetching or sending
      console.error('❌ Error fetching or sending the coffee image:', error);

      // Notify user of the error with font styling
      await sendMessage(senderId, { 
        text: '❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝘁𝗵𝗲 𝗰𝗼𝗳𝗳𝗲𝗲 𝗶𝗺𝗮𝗴𝗲.' 
      }, pageAccessToken);
    }
  }
};
