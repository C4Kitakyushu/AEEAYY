const axios = require('axios');
module.exports = {
  name: 'claude',
  description: 'ask to caude sonnet',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    try {
      const apiUrl = `https://rest-api.joshuaapostol.site/blackbox/model/claude-sonnet-3.5?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.result;

      sendMessage(senderId, { text }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Claude Sonnet API:', error);
      sendMessage(senderId, { text: 'There was an error with your request.' }, pageAccessToken);
    }
  }
};
