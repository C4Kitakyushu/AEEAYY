const axios = require('axios');

module.exports = {
  name: 'history',
  description: 'Search and know about historical events.',
  author: 'kshitiz',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, { text: "Please provide a search query (e.g., history Anglo-Nepal war)." }, pageAccessToken);
    }

    try {
      const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);

      if (response.data.title && response.data.extract) {
        const title = response.data.title;
        const extract = response.data.extract;

        const message = `Information about "${title}":\n${extract}`;
        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `No information found for "${searchQuery}".` }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching historical information:', error);
      sendMessage(senderId, { text: "An error occurred while fetching historical information." }, pageAccessToken);
    }
  }
};