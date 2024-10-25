const axios = require('axios');

module.exports = {
  name: 'catfact',
  description: 'random cat fact',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const apiUrl = 'https://rest-api.joshuaapostol.site/cat-fact';
      const response = await axios.get(apiUrl);
      const catFact = response.data.fact;

      if (catFact) {
        const message = `🐱 𝗖𝗮𝘁 𝗙𝗮𝗰𝘁 🐾\n\n➜ ${catFact}\n\nReact with 👍 to unsend if you are the sender.`;
        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: '🚫 No cat facts found.' }, pageAccessToken);
      }
    } catch (error) {
      console.error("🚫 Error fetching cat fact:", error);
      sendMessage(senderId, { text: '❌ An error occurred while fetching the cat fact.' }, pageAccessToken);
    }
  }
};
