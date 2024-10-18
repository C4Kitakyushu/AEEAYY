const axios = require('axios');

module.exports = {
  name: 'trivia',
  description: 'fetches a random trivia question.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length > 0) {
      return sendMessage(senderId, { text: "‼️ This command does not require additional arguments." }, pageAccessToken);
    }

    sendMessage(senderId, { text: "⚙️ Fetching a trivia question for you..." }, pageAccessToken);

    try {
      const response = await axios.get('https://nash-rest-api-production.up.railway.app/trivia');
      const trivia = response.data;

      if (!trivia || !trivia.question) {
        return sendMessage(senderId, { text: "😼Sorry, I couldn't fetch a trivia question at the moment." }, pageAccessToken);
      }

      sendMessage(senderId, { text: `✅ Here's a trivia question for you:\n\n${trivia.question}` }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};