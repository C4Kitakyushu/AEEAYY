const axios = require('axios');

module.exports = {
  name: 'fact',
  description: 'fetches a random fact.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length > 0) {
      return sendMessage(senderId, { text: "‼️ This command does not require additional arguments." }, pageAccessToken);
    }

    sendMessage(senderId, { text: "⚙️ Fetching a random fact for you..." }, pageAccessToken);

    try {
      const response = await axios.get('https://nash-rest-api-production.up.railway.app/fact');
      const fact = response.data;

      if (!fact || !fact.fact) {
        return sendMessage(senderId, { text: "☹️ Sorry, I couldn't fetch a fact at the moment." }, pageAccessToken);
      }

      sendMessage(senderId, { text: `👍 Here's a random fact for you:\n\n${fact.fact}` }, pageAccessToken);
    } catch (error) {
      console.error("❌ Error fetching fact:", error);
      sendMessage(senderId, { text: `An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};