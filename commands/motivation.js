
const axios = require('axios');

module.exports = {
  name: 'motivation',
  description: 'fetches a random motivational quote.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length > 0) {
      return sendMessage(senderId, { text: "‼️ This command does not require additional arguments." }, pageAccessToken);
    }

    sendMessage(senderId, { text: "⚙ Fetching a motivational quote for you..." }, pageAccessToken);

    try {
      const apiUrl = 'https://apizaryan.onrender.com/api/motivation';
      const response = await axios.get(apiUrl);
      const quote = response.data;

      if (!quote || !quote.message) {
        return sendMessage(senderId, { text: "☹ Sorry, I couldn't fetch a motivational quote at the moment." }, pageAccessToken);
      }

      const message = `💪 Here's your motivational quote:\\━━━━━━━━━━━━━━━━━━━━━━━\n➜ ${quote.message}\n━━━━━━━━━━━━━━━━━━━━━━━`;

      // Send the motivational quote
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching motivation:', error);
      sendMessage(senderId, { text: `❌ An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};
