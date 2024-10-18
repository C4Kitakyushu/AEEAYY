const axios = require('axios');

module.exports = {
  name: 'ashley',
  description: 'talk to ashley masarap',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    try {
      const apiUrl = `https://markdevs-last-api-2epw.onrender.com/api/ashley?query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.result; // Adjust based on the actual response structure

      // Send the response back to the user
      sendMessage(senderId, { text }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Ashley API:', error);
      sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
