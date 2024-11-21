const axios = require('axios');

module.exports = {
  name: 'chatgpt',
  description: 'Generates AI-based responses from the API.',
  usage: '!generateAI <your text>',
  author: 'Ali',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const inputText = args.join(' ').trim();

    if (!inputText) {
      return sendMessage(senderId, { text: '❌ Please provide your input for AI generation.\n\nExample: Tell me a joke.' }, pageAccessToken);
    }

    try {
      const response = await axios.get('https://mekumi-rest-api.onrender.com/api/ai', {
        params: { data: inputText }
      });

      const aiResponse = response.data.generatedText ? response.data.generatedText : 'No response generated.';

      sendMessage(senderId, { text: aiResponse }, pageAccessToken); // Send the AI-generated response to the user

    } catch (error) {
      console.error('Error generating AI response:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error generating the response. Please try again later.' }, pageAccessToken);
    }
  }
};
