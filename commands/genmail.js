const axios = require('axios');

module.exports = {
  name: 'gentemp',
  description: 'Generate a temporary email.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const apiUrl = 'https://markdevs-last-api.onrender.com/api/gen';
      const response = await axios.get(apiUrl);

      const email = response.data.email;
      if (!email) {
        return sendMessage(senderId, { text: "Failed to generate a temporary email. Please try again." }, pageAccessToken);
      }

      const message = `✉️ Generated Temporary Email: ${email}\n\nPlease use the 'mailbox' command to see your tempmail inbox.`;
      sendMessage(senderId, { text: message }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: "❌ An error occurred while generating the temporary email." }, pageAccessToken);
    }
  }
};
