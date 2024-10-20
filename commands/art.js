const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'art',
  description: 'generates art based on a given prompt',
  usage: 'art [prompt]',
  author: 'coffee',
  async execute(senderId, args, pageAccessToken) {
    if (!Array.isArray(args) || args.length === 0) {
      return sendMessage(senderId, { text: 'Please provide a prompt.' }, pageAccessToken);
    }

    const prompt = args.join(' ');
    const apiUrl = `https://ccprojectsjonellapis-production.up.railway.app/api/generate-art?prompt=${encodeURIComponent(prompt)}`;

    try {
      const { data: { imageUrl } } = await axios.get(apiUrl);

      if (imageUrl) {
        return sendMessage(senderId, { attachment: { type: 'image', payload: { url: imageUrl } } }, pageAccessToken);
      }

      sendMessage(senderId, { text: 'Error: Image URL not found in the response.' }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, { text: 'Error: Could not retrieve the image.' }, pageAccessToken);
    }
  }
};
