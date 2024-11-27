const axios = require('axios');

module.exports = {
  name: 'jea',
  description: 'get a response from jea gf',
  author: 'Rynx',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const question = args.join(' ') || 'hi';

    try {
      const apiUrl = `https://mekumi-rest-api.onrender.com/api/jea?question=${encodeURIComponent(question)}`;
      const response = await axios.get(apiUrl);
      const content = response.data.content;

      if (content) {
        // Split the response into chunks if it exceeds 2000 characters
        const maxMessageLength = 2000;
        if (content.length > maxMessageLength) {
          const messages = splitMessageIntoChunks(content, maxMessageLength);
          for (const message of messages) {
            sendMessage(senderId, { text: message }, pageAccessToken);
          }
        } else {
          sendMessage(senderId, { text: content }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: 'Sorry, no response found.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error retrieving response from Jea:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
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
