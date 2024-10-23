const axios = require('axios');

module.exports = {
  name: 'appstate',
  description: 'Retrieve application cookie from API',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const [email, password] = args;

    if (!email || !password) {
      return sendMessage(senderId, { text: 'Please enter a valid email and password.' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | Retrieving cookie, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://joshweb.click/getcookie?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const cookie = response.data.cookie;

      if (cookie) {
        sendMessage(senderId, { text: `Here is your cookie: ${cookie}` }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: '❌ Failed to retrieve cookie. Please check your credentials and try again.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching cookie:', error.message);
      sendMessage(senderId, { text: `❌ An error occurred while retrieving the cookie. Error details: ${error.message}` }, pageAccessToken);
    }
  }
};
