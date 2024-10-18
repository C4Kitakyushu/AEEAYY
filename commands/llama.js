const axios = require('axios');

module.exports = {
  name: 'llama',
  description: 'talk to llama ',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    try {
      const apiUrl = `https://deku-rest-apis.ooguy.com/api/llama-3-70b?q=${encodeURIComponent(prompt)}&uid=100${senderId}`;
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
