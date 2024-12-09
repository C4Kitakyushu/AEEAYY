const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'aigf',
  description: 'talk to virtual gf',
  usage: 'aigf [your message]',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) {
      return sendMessage(senderId, { text: "Hello baby, how can i assist you today?" }, pageAccessToken);
    }

    try {
      const { data: { result } } = await axios.get(`https://api.joshweb.click/ai-gf?q=${encodeURIComponent(prompt)}&uid=${senderId}`);
      sendMessage(senderId, { text: result }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'There was an error generating the response. Please try again later.' }, pageAccessToken);
    }
  }
};
