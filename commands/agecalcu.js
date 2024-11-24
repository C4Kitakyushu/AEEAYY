const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Interact with AI models',
  usage: 'ai [your message]',
  author: 'jerome',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) {
      return sendMessage(senderId, { text: "Usage: ai <question>" }, pageAccessToken);
    }

    try {
      // Define the model and system message
      const model = "gpt-4-turbo-2024-04-09"; // Example model, change as needed
      const systemMessage = "You are a helpful assistant.";

      // Construct the API URL
      const apiUrl = `https://mekumi-rest-api.onrender.com/api/ai?model=${encodeURIComponent(model)}&system=${encodeURIComponent(systemMessage)}&question=${encodeURIComponent(prompt)}`;

      // Send the API request
      const { data } = await axios.get(apiUrl);

      // Handle the response
      if (data && data.message) {
        sendMessage(senderId, { text: data.message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
      }
    } catch {
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
