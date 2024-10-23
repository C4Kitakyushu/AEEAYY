const axios = require('axios');

module.exports = {
  name: 'gemini',
  description: 'gemini [ reply image ]',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage, event) {
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return sendMessage(senderId, { text: '❌ This command only works with a photo.' }, pageAccessToken);
    }

    if (event.type !== "message_reply" || !event.messageReply.attachments[0] || event.messageReply.attachments[0].type !== "photo") {
      return sendMessage(senderId, { text: '❌ Please reply to a photo with this command.' }, pageAccessToken);
    }

    const url = encodeURIComponent(event.messageReply.attachments[0].url);
    sendMessage(senderId, { text: '🕧 Gemini recognizing picture, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://joshweb.click/gemini?prompt=${encodeURIComponent(prompt)}&url=${url}`);
      const description = response.data.gemini;

      const message = `GEMINI ✨🤖𝑰\n━━━━━━━━━━━━━━━\n${description}\n━━━━━━━━━━━━━━━`;
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      sendMessage(senderId, { text: '❌ An error occurred while processing your request.' }, pageAccessToken);
    }
  }
};
