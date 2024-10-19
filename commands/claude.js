const axios = require('axios');

module.exports = {
  name: 'claude',
  description: 'ask to claude sonnet 3.5',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    
    if (!prompt) {
      sendMessage(senderId, { text: 'Please provide a valid question.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://rest-api.joshuaapostol.site/blackbox/model/claude-sonnet-3.5?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const answer = response.data.response;

      sendMessage(senderId, { text: `🤖 CLAUDE SONNET 3.5 AI\n━━━━━━━━━━━━━━━━━━\n${answer}\n━━━━━━━━━━━━━━━━━━` }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Claude Sonnet API:', error);
      sendMessage(senderId, { text: '❌ | An error occurred while processing your request.' }, pageAccessToken);
    }
  }
};
