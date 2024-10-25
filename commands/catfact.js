const axios = require('axios');

module.exports = {
  name: 'catfact',
  description: 'fetches a random cat fact.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "🐱 Fetching a cat fact for you..." }, pageAccessToken);

    try {
      const apiUrl = 'https://rest-api.joshuaapostol.site/cat-fact';
      const response = await axios.get(apiUrl);
      const catFact = response.data.fact;

      if (catFact) {
        const message = `😸 Here's a cat fact for you: \n\n${catFact}`;
        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: "☹️ Sorry, I couldn't fetch a cat fact at the moment." }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching cat fact:', error);
      sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
    }
  }
};
