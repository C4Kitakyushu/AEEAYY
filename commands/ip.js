const axios = require('axios');

module.exports = {
  name: 'gpt',
  description: 'ask to gpt4',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    const uid = senderId; // Assuming uid is the same as senderId; adjust as needed.
    
    try {
      const apiUrl = `https://markdevs-last-api-2epw.onrender.com/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${uid}`;
      const response = await axios.get(apiUrl);
      const text = response.data.result; // Adjust based on the actual response structure

      // Send the response back to the user
      sendMessage(senderId, { text }, pageAccessToken);
    } catch (error) {
      console.error('Error calling GPT4 API:', error);
      sendMessage(senderId, { text: 'An error occurred while processing your request.' }, pageAccessTo
ken);
    }
  }
};