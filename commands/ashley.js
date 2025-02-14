const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'deepseek',
  description: 'Talk to DeepSeek AI',
  usage: 'deepseek <your message>',
  author: 'developer',
  version: '1.0.0',
  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ');

    if (!query) {
      return sendMessage(senderId, { text: 'Please enter a message to send to DeepSeek AI.' }, pageAccessToken);
    }

    const typingNotification = await sendMessage(senderId, { text: 'Typing...' }, pageAccessToken);

    const apiUrl = `https://kaiz-apis.gleeze.com/api/deepseek-r1?ask=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(apiUrl);
      const aiResponse = response.data.result || 'No response from DeepSeek AI.';

      await sendMessage(senderId, { text: aiResponse }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);

      await sendMessage(senderId, { text: '❌ An error occurred. Please try again later.' }, pageAccessToken);
    }
  }
};