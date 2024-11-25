const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'catgpt',
  description: 'Send a message to the CatGPT API and get a response.',
  usage: 'catgpt <message>',
  author: 'Ali',

  async execute(senderId, args, pageAccessToken) {
    // Check if a message was provided
    if (!args.length) {
      return sendMessage(senderId, 'Please provide a message to send to CatGPT.');
    }

    // Combine the args into a single message
    const message = args.join(' ');

    // Function to send a request to the API
    async function getCatGPTResponse(message) {
      const apiUrl = `https://jerome-web.onrender.com/service/api/catgpt?message=${encodeURIComponent(message)}`;

      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        console.log('Response:', data);

        // Send the response data to the sender
        sendMessage(senderId, data.response || 'No response from CatGPT.');
      } catch (error) {
        console.error('Error:', error);

        // Send an error message to the sender
        sendMessage(senderId, 'An error occurred while communicating with CatGPT.');
      }
    }

    // Call the function with the provided message
    getCatGPTResponse(message);
  }
};
