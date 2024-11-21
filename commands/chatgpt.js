const axios = require('axios');

module.exports = {
  name: 'chatgpt',
  description: 'Generate responses from AI.',
  author: 'Ali',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ Please provide your input for AI generation.\n\nExample: Tell me a joke.' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⌛ AI is processing your request, please wait...' }, pageAccessToken);

    try {
      const response = await axios.post('https://mekumi-rest-api.onrender.com/api/ai', {
        data: userInput,
      });

      const aiResponse = response.data.generatedText ? response.data.generatedText : 'No response generated.';

      const formattedResponse = `
🤖 AI Response
━━━━━━━━━━━━━━━━━━
${aiResponse}
━━━━━━━━━━━━━━━━━━

      `;

      sendMessage(senderId, { text: formattedResponse.trim() }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'An error occurred while generating the AI response.' }, pageAccessToken);
    }
  }
};
