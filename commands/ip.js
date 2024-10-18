const axios = require('axios');

module.exports = {
  name: 'gpt',
  description: 'interact with gpt-4O',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    const uid = senderId; // Assuming uid is the same as senderId; adjust as needed.

    try {
      const apiUrl = `https://ccprojectsjonellapis-production.up.railway.app/api/gpt4o-v2?prompt=${encodeURIComponent(prompt)}&uid=${uid}`;
      const response = await axios.get(apiUrl);
      const text = response.data.result; // Adjust based on the actual response structure

      // Send the response back to the user
      sendMessage(senderId, { text }, pageAccessToken);
    } catch (error) {
      console.error('Error calling GPT-4O API:', error);
      sendMessage(senderId, { text: 'An error occurred while processing your request.' }, pageAccessToken);
    }
  }
};
