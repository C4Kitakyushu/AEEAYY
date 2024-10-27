const axios = require('axios');

module.exports = {
  name: 'joke',
  description: 'fetches a random joke.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⚙️ Fetching a corny joke for you..." }, pageAccessToken);

    try {
      const apiUrl = 'https://c-v5.onrender.com/api/joke';
      const response = await axios.get(apiUrl);
      const joke = response.data.joke;

      if (joke) {
        const message = `🤣 Here's a corny joke for you: \n\n 😁 ${joke}\n\hahaha tanginaka🫵😹`;
        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: "☹️ Sorry, I couldn't fetch a joke at the moment." }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching joke:', error);
      sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
    }
  }
};