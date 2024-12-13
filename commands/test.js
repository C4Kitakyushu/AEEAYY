const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Detect AI-generated content from a given text.',
  author: 'Deku (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    if (!prompt) {
      return sendMessage(
        senderId,
        { text: '❌ Please provide some text to analyze.' },
        pageAccessToken
      );
    }

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/aidetector-v2?q=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const { ai, human, message } = response.data;

      // Build the response message
      const resultMessage = `🎯 **AI Detector Results** 🎯\n\n📊 AI Likelihood: ${ai}%\n👤 Human Likelihood: ${human}%\n\n💡 Message: ${message}`;

      // Split the response into chunks if it exceeds 2000 characters
      const maxMessageLength = 2000;
      if (resultMessage.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(resultMessage, maxMessageLength);
        for (const chunk of messages) {
          sendMessage(senderId, { text: chunk }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: resultMessage }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling AI Detector API:', error);
      sendMessage(senderId, { text: '❌ Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
