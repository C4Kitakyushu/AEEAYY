const axios = require('axios');

module.exports = {
  name: 'quote',
  description: 'Get a random inspirational quote.',
  author: 'Developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "🕗 | Fetching a random quote, please wait..." }, pageAccessToken);

    try {
      const response = await axios.get('https://api.quotable.io/random');
      const { content, author } = response.data;

      if (!content || !author) {
        return sendMessage(senderId, { text: '☹ Sorry, I couldn’t fetch a quote at the moment.' }, pageAccessToken);
      }

      const message = `"${content}"/n// - ${author}`;
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching quote:', error);
      sendMessage(senderId, { text: "❌ Sorry, I couldn't fetch a quote at the moment. Please try again later." }, pageAccessToken);
    }
  }
};
