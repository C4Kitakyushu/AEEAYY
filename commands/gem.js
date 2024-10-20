const axios = require('axios');

module.exports = {
  name: 'gemini',
  description: 'Interact with Gemini to describe a photo.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage, event) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, { text: "This command only works with a photo." }, pageAccessToken);
    }

    if (event.type !== "message_reply" || !event.messageReply.attachments[0] || event.messageReply.attachments[0].type !== "photo") {
      return sendMessage(senderId, { text: "Please reply to a photo with this command." }, pageAccessToken);
    }

    const url = encodeURIComponent(event.messageReply.attachments[0].url);

    try {
      sendMessage(senderId, { text: "🤖 GEMINI ✨\n━━━━━━━━━━━━━━━━━━\nGemini recognizing picture, please wait...\n━━━━━━━━━━━━━━━━━━" }, pageAccessToken);

      const apiUrl = `https://joshweb.click/gemini?prompt=${encodeURIComponent(prompt)}&url=${url}`;
      const response = await axios.get(apiUrl);
      const description = response.data.gemini;

      return sendMessage(senderId, { text: `🤖 GEMINI ✨\n━━━━━━━━━━━━━━━━━━\n${description}\n━━━━━━━━━━━━━━━━━━` }, pageAccessToken);
    } catch (error) {
      console.error('Error processing the photo:', error);
      return sendMessage(senderId, { text: "❌ | An error occurred while processing your request." }, pageAccessToken);
    }
  }
};
