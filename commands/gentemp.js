const axios = require('axios');

module.exports = {
  name: 'randomemail',
  description: 'generate a random email',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const apiUrl = 'https://markdevs-last-api-2epw.onrender.com/api/gen';
      const response = await axios.get(apiUrl);

      const email = response.data.email;
      if (!email) {
        return sendMessage(senderId, { text: 'Failed to generate a temporary email. Please try again.' }, pageAccessToken);
      }

      const message = `✅ Generated Temporary Email: ${email}\n\n‼️Please use the 'checkinbox <email> to see message inbox`;
      sendMessage(senderId, { text: message }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, { text: 'An error occurred while generating the temporary email. Please try again later.' }, pageAccessToken);
    }
  }
};
