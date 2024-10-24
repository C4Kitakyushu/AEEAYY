const axios = require('axios');

module.exports = {
  name: 'insult',
  description: 'Get a random insult.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⌛ Fetching a random insult for you..." }, pageAccessToken);

    try {
      const apiUrl = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';
      const response = await axios.get(apiUrl);
      const insult = response.data.insult;

      if (insult) {
        const message = `😈 Here's a random insult for you: \n\n 💢${insult}`;
        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: "☹️ Sorry, I couldn't fetch an insult at the moment." }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching insult:', error);
      sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
    }
  }
};
