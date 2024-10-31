const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'appstate',
  description: 'Fetch AppState based on email and password',
  usage: 'getAppState <email> <password>',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const [email, password] = args;

    if (!email || !password) {
      return sendMessage(senderId, { text: '❌ Please enter both email and password.' }, pageAccessToken);
    }

    const apiUrl = `https://joshweb.click/getcookie?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      sendMessage(senderId, { text: `AppState: ${JSON.stringify(data, null, 4)}` }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: '❌ Failed to fetch AppState. Please try again.' }, pageAccessToken);
    }
  },
};
