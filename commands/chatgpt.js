const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'chatgpt',
  description: 'Fetches response from GPT API',
  usage: 'gpt-command <message>',
  author: 'Ali',

  async execute(senderId, args, pageAccessToken) {
    const question = args.join(' ');
    if (! question) {
      sendMessage(senderId, { text: 'Please provide a question.' }, pageAccessToken);
      return;
    }

    try {
      const response = await axios.get(`https://mekumi-rest-api.onrender.com/api/chatgpt?question=${encodeURIComponent(question)}`);
      const answer = response.data.answer;

      sendMessage(senderId, { text: answer }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, something went wrong. Please try again later.' }, pageAccessToken);
    }
  }
};
