const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'humanizer',
  description: 'humanize the ai generated text',
  usage: 'Humanizer [AI-generated text here]',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {

    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: humanizer Your AI-generated text here" }, pageAccessToken);

    try {
       const response = await axios.get(`https://kaiz-apis.gleeze.com/api/humanizer?q=${encodeURIComponent(prompt)}`);
      const mess = response.data.response;

      const parts = [];

            for (let i = 0; i < mess.length; i += 1999) {
                parts.push(mess.substring(i, i + 1999));
            }

            // send all msg parts
            for (const part of parts) {
                await sendMessage(senderId, { text: part }, pageAccessToken);
            }

      //sendMessage(senderId, { text: data.response }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};