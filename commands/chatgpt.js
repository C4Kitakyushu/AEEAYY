const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gpt',
  description: 'Interact with GPT-4o',
  usage: 'gpt4 [your message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    try {
      // Construct the user question from the command arguments
      const userQuestion = args.join(' ');
      if (!userQuestion) {
        return sendMessage(senderId, 'Please provide a question or message to send to GPT-4.', pageAccessToken);
      }

      // Make the API request
      const response = await axios.get(`https://mekumi-rest-api.onrender.com/api/chatgpt?question=${encodeURIComponent(userQuestion)}`);
      
      // Check if the response data contains the expected structure
      if (response.data && response.data.message) {
        const reply = response.data.message;
        await sendMessage(senderId, reply, pageAccessToken);
      } else {
        // Provide a fallback if the response format is unexpected
        await sendMessage(senderId, 'No valid response received from the API.', pageAccessToken);
      }

    } catch (error) {
      console.error('Error interacting with the API:', error);
      await sendMessage(senderId, 'An error occurred while trying to communicate with GPT-4.', pageAccessToken);
    }
  }
};
