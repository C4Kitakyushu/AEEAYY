const axios = require('axios');

module.exports = {
  name: 'aigf',
  description: 'talk to virtual ai girlfriend',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '😁uhmm.. hello baby how are you today? I'm glad to meet you again😚🥰' }, pageAccessToken);
   

    
    try {
      const response = await axios.get('https://joshweb.click/api/ai-gf', {
        params: { q: userInput }
      });
      const responseData = response.data;
      const responseString = responseData.result ? responseData.result : 'No result found.';

      const formattedResponse = `
💬 AI Girlfriend👥Conversation
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
      `;

      sendMessage(senderId, { text: formattedResponse.trim() }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'An error occurred while fetching the response.' }, pageAccessToken);
    }
  }
};
