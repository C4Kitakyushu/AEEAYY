const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'chatgpt',
  description: 'Interact with Gpt',
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
      
      // Send the API response back to the user
      const reply = response.data.answer || 'Sorry, no response was returned.';
      await sendMessage(senderId, reply, pageAccessToken);
      
    } catch (error) {
      console.error('Error interacting with the API:', error);
      await sendMessage(senderId, 'An error occurred while trying to communicate with GPT-4.', pageAccessToken);
    }
  }
};
