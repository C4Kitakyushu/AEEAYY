const axios = require('axios');

module.exports = {
  name: 'chatgpt',
  description: 'Generates AI-based responses from the API.',
  usage: '!generateAI <your text>',
  author: 'Ali',

  async execute(senderId, args, pageAccessToken) {
    const inputText = args.join(' ');

    try {
      const response = await axios.post('https://mekumi-rest-api.onrender.com/api/ai', {
        data: inputText,
      });

      const aiResponse = response.data.generatedText; // Assuming the response has a 'generatedText' field

      sendMessage(senderId, aiResponse); // Send the AI-generated response to the user

    } catch (error) {
      console.error('Error generating AI response:', error);
      sendMessage(senderId, 'Sorry, there was an error generating the response. Please try again later.');
    }
  }
};
