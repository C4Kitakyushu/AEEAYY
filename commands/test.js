const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Sends a random meme.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    try {
      // Define the API endpoint to fetch a random meme
      const apiUrl = 'https://meme-api.com/gimme/memes';

      // Make the GET request to the Meme API
      const response = await axios.get(apiUrl);
      const meme = response.data;

      // Send the meme image with its title as the caption
      await sendMessage(
        senderId,
        {
          attachment: {
            type: 'image',
            payload: { url: meme.url },
          },
          text: meme.title,
        },
        pageAccessToken
      );
    } catch (error) {
      console.error('Error fetching meme:', error);
      await sendMessage(senderId, { text: 'Error: Could not fetch meme.' }, pageAccessToken);
    }
  },
};