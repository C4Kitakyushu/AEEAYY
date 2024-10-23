const axios = require('axios');

module.exports = {
  name: 'appstate',
  description: 'fbstate getter',
  author: 'Eugene Aguilar',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const [email, password] = args;

    if (!email || !password) {
      return sendMessage(senderId, { text: 'Please enter an email and password.' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | Getting application state, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://joshweb.click/getcookie?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const appState = response.data.app_state;

      sendMessage(senderId, { text: `Here's your application state: ${appState}` }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching app state:', error.message);
      sendMessage(senderId, { text: `❌ An error occurred while getting the application state. Please try again later. Error details: ${error.message}` }, pageAccessToken);
    }
  }
};
