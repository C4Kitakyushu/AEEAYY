const axios = require('axios');

module.exports = {
  name: 'spamshare',
  description: 'submitAppState <appState> <url> <amount> <interval>',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const appState = args[0];
    const url = args[1];
    const amount = parseInt(args[2], 10);
    const interval = parseInt(args[3], 10);
    const serverUrl = 'https://autoshare-ya35.onrender.com/api/submit';

    // Validation check
    if (!appState || !url || isNaN(amount) || isNaN(interval) || amount <= 0 || interval < 0) {
      return sendMessage(senderId, { text: 'Usage: submitAppState <appState> <url> <amount> <interval>' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⚙️ Processing your submission request...' }, pageAccessToken);

    // Sending the request to the server
    try {
      const response = await axios.post(serverUrl, {
        cookie: appState,
        url: url,
        amount: amount,
        interval: interval
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 200) {
        sendMessage(senderId, { text: 'Submitted successfully ✅.' }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `Error: ${response.data.message}` }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'Network error, please try again later.' }, pageAccessToken);
    }
  }
};
