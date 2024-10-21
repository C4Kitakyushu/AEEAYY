const axios = require('axios');

module.exports = {
  name: 'llama',
  description: 'talk to llama 3.2-11b',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    try {
      const apiUrl = `https://joshweb.click/ai/llama-3.2-11b-vision-instruct?q=${encodeURIComponent(prompt)}&uid=${senderId}`;
      const response = await axios.get(apiUrl);
      const text = response.data.result;

      // Send the response back to the user
      sendMessage(senderId, { text }, pageAccessToken);
    } catch (error) {
      console.error('Error calling LLaMA API:', error);
      sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
