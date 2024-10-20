const axios = require('axios');

module.exports = {
  name: 'gpt',
  description: 'aak to gpt4o model ',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    if (!prompt) {
      sendMessage(senderId, { text: "Usage: gpt <question>" }, pageAccessToken);
      return;
    }

    sendMessage(senderId, { text: '🕜 | Answering your question... Please wait.' }, pageAccessToken);

    try {
      const apiUrl = `https://joshweb.click/api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=${senderId}`;
      const response = await axios.get(apiUrl);

      // Assuming the API returns the result in the response.data.result
      const result = response.data.result;

      if (result) {
        sendMessage(senderId, { text: `MIGO ASSISTANT 🤖✨\n\n${result}` }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'No result was returned from the API.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error calling GPT-4o API:', error.message);
      sendMessage(senderId, { text: 'An error occurred while generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};