const axios = require('axios');

module.exports = {
  name: 'spamshare',
  description: 'spamshare',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const [state, fburl, quantity, delay] = args;

    if (!appstate || !pogiUrl || !quantity || !delay) {
      return sendMessage(senderId, { text: 'Please provide all required parameters: state, url, quantity, and delay.' }, pageAccessToken);
    }

    const apiUrl = `https://rest-api.joshuaapostol.site/spamshare?state=${appstate}&url=${fburll}&quantity=${quantity}&delay=${delay}`;

    try {
      const response = await axios.get(apiUrl);
      const result = response.data;

      // Send the response back to the user
      sendMessage(senderId, { text: JSON.stringify(result, null, 2) }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
