const axios = require('axios');
module.exports = {
  name: 'flux',
  description: 'ask to flux image generator',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    try {
      const apiUrl = `https://joshweb.click/api/flux?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const image = response.data;

      sendMessage(senderId, { attachment: image }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Flux API:', error);
      sendMessage(senderId, { text: 'An error occurred while generating the image.' }, pageAccessToken);
    }
  }
};
