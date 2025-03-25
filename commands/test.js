const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Fetch a specific law based on a given number.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const lawNumber = args[0]; // The number of the law to fetch.

    if (!lawNumber) {
      return sendMessage(senderId, {
        text: '❌ Please provide a law number. Example:\n\n**law <number>**'
      }, pageAccessToken);
    }

    // Notify the user that the request is being processed.
    await sendMessage(senderId, {
      text: '⌛ Fetching the law details, please wait...'
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://haji-mix.up.railway.app/api/law?number=${encodeURIComponent(lawNumber)}`;
      const response = await axios.get(apiUrl);

      // Parse API response
      const { status, title, law, message } = response.data;

      if (status) {
        await sendMessage(senderId, {
          text: `✅ **Title:** ${title}\n**Law:** ${law}`
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: `❌ Failed to fetch the law. Message: ${message || 'Unknown error'}.`
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❌ Error fetching law:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while fetching the law. Please try again later.'
      }, pageAccessToken);
    }
  }
};