const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Generate responses using GPT-4o Pro with optional image support.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || args.length < 2) {
      sendMessage(senderId, { text: '❌ Please provide a query and a user ID (UID). Example: gpt-4o-pro What is AI? 4' }, pageAccessToken);
      return;
    }

    const uid = args.pop(); // Extract UID
    const ask = args.join(' ');

    // Validate UID
    if (isNaN(uid)) {
      sendMessage(senderId, { text: '❌ Invalid UID. Please provide a numeric UID.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o-pro?ask=${encodeURIComponent(ask)}&uid=${encodeURIComponent(uid)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.reply) {
        // Send GPT-4 reply
        sendMessage(senderId, { text: `🤖 **GPT-4 Response:**\n${response.data.reply}` }, pageAccessToken);
      } else {
        console.error('Error: No reply found in API response.');
        sendMessage(senderId, { text: '❌ Sorry, no response was generated. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling GPT-4o Pro API:', error);
      sendMessage(senderId, { text: '❌ An error occurred while processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};