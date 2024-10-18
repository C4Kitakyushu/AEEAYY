const axios = require('axios');

module.exports = {
  name: 'advice',
  description: 'fetches a random piece of advice.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length > 0) {
      return sendMessage(senderId, { text: "‼️ This command does not require additional arguments." }, pageAccessToken);
    }

    sendMessage(senderId, { text: "⚙ Fetching a random piece of advice for you..." }, pageAccessToken);

    try {
      const apiUrl = 'https://nash-rest-api-production.up.railway.app/advice';
      const response = await axios.get(apiUrl);
      const advice = response.data;

      if (!advice || !advice.advice) {
        return sendMessage(senderId, { text: "☹ Sorry, I couldn't fetch any advice at the moment." }, pageAccessToken);
      }

      const message = `🫂 Here's a random piece of advice for you:\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n➜ ${advice.advice}\n━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      // Send the advice
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching advice:', error);
      sendMessage(senderId, { text: `❌ An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};