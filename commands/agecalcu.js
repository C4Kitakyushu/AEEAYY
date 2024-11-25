const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Interact with GPT-4o via Mekumi API',
  usage: 'gpt4 [your message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');

    // Ensure the user provided a prompt
    if (!prompt) {
      return sendMessage(senderId, 'Please provide a message for GPT-4.');
    }

    // Define system context and available model (can be adjusted as needed)
    const system = 'You are a helpful assistant.';
    const model = 'gpt-4-turbo-2024-04-09'; // Example model, can be changed

    try {
      // Build the URL with the necessary query parameters
      const apiUrl = `https://mekumi-rest-api.onrender.com/api/ai?model=${encodeURIComponent(model)}&system=${encodeURIComponent(system)}&question=${encodeURIComponent(prompt)}`;

      // Send the GET request to the API
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