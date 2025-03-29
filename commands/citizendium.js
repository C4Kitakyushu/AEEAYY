const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'citizendium',
  description: 'fetch information from citizendium library.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ');

    if (!query) {
      return sendMessage(senderId, {
        text: '❌ Usage: provide a word or phrase.\n\nExample: citizendium cat'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: '⌛ Fetching information, please wait...'
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://jerome-web.gleeze.com/service/api/citizendium?word=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      // Parse API response
      const { title, description, source } = response.data;

      if (!description) {
        return sendMessage(senderId, {
          text: `❌ No information found for the query: **${query}**.`
        }, pageAccessToken);
      }

      // Split the description into chunks
      const chunkSize = 640; // Define chunk size
      const descriptionChunks = description.match(new RegExp(`.{1,${chunkSize}}`, 'g'));

      // Send each chunk as a separate message
      for (let i = 0; i < descriptionChunks.length; i++) {
        await sendMessage(senderId, {
          text: descriptionChunks[i]
        }, pageAccessToken);
      }

      // Send the source as the last message
      await sendMessage(senderId, {
        text: `📚 Source: ${source}`
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error fetching information:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while fetching the information. Please try again later.'
      }, pageAccessToken);
    }
  }
};