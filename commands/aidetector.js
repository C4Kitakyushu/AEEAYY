const axios = require('axios');

module.exports = {
  name: 'aidetector',
  description: 'detect if the generated text is an ai or human!',
  admin: false,
  async execute(senderId, args, pageAccessToken, sendMessage) {

    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "❌ Provide text" }, pageAccessToken);

    sendMessage(senderId, { text: "⌛ Searching please wait..." }, pageAccessToken);

    try {
      const response = await axios.get(`https://kaiz-apis.gleeze.com/api/mal?title=${encodeURIComponent(prompt)}`);
      const ai = response.data.ai;
      const human = response.data.human;
      const message = response.data.message;

      const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

      sendMessage(senderId, { 
        text: `Ai detector\n\nAi: ${ai}\n\nHuman: ${human}\n\nMessage: ${message}\n` 
      }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};