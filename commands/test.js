cconst axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gpt4',
  description: 'Interact with GPT-4 via the Mekumi API',
  usage: 'gpt4 [your message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');

    // Ensure the user provided a prompt
    if (!prompt) {
      return sendMessage(senderId, 'Please provide a message for GPT-4.');
    }

    try {
      // Construct the API URL with the 'question' query parameter
      const apiUrl = `https://mekumi-rest-api.onrender.com/api/chatgpt?question=${encodeURIComponent(prompt)}`;

      // Make the GET request to the Mekumi API
      const response = await axios.get(apiUrl);

      // Extract the answer from the API response
      const answer = response.data.answer;

      // Send the response back to the user
      if (answer) {
        sendMessage(senderId, answer);
      } else {
        sendMessage(senderId, 'Sorry, I could not get a response from the API.');
      }

    } catch (error) {
      console.error('Error interacting with Mekumi API:', error);
      sendMessage(senderId, 'Sorry, there was an error while processing your request.');
    }
  }
};
