const axios = require('axios');

module.exports = {
  name: 'wattpad',
  description: 'Search for stories on Wattpad.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, { text: "Please provide a search query for Wattpad." }, pageAccessToken);
    }

    try {
      const apiUrl = `https://joshweb.click/api/wattpad?q=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.status || !data.result || data.result.length === 0) {
        return sendMessage(senderId, { text: `No results found on Wattpad for the given query.` }, pageAccessToken);
      }

      // Prepare the response message with multiple results
      let message = `📖 Wattpad Search Results :\n\n`;

      // Iterate over the results
      data.result.forEach((item, index) => {
        message += `📚 ${index + 1}. *${item.title}*\n👁️ Reads: ${item.read}\n👍 Votes: ${item.vote}\n🔗 [Read Here](${item.link})\n\n`;
      });

      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching Wattpad data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching Wattpad data." }, pageAccessToken);
    }
  }
};
