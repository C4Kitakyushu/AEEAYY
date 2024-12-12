const axios = require('axios');

module.exports = {
  name: 'scrape',
  description: 'html scraper',
  author: 'dev',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length === 0) {
      sendMessage(senderId, { text: '❌ Please provide a URL to scrape.' }, pageAccessToken);
      return;
    }

    const url = args[0];
    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/scrape?url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl);
      const htmlData = response.data.data;

      // Split the response into chunks if it exceeds 2000 characters
      const maxMessageLength = 2000;
      if (htmlData.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(htmlData, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: htmlData }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Scrape API:', error);
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
