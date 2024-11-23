const axios = require('axios');

module.exports = {
  name: 'wattpad',
  description: 'Search for stories on Wattpad based on the given query.',
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

      if (!data.result || data.result.length === 0) {
        return sendMessage(senderId, { text: `No stories found on Wattpad for the given query.` }, pageAccessToken);
      }

      // Format the first 5 results for the response message
      const formattedResults = data.result.slice(0, 5).map((story, index) => {
        return `📖 ${index + 1}. *${story.title}*\n👤 Author: ${data.author}\n👀 Reads: ${story.read}\n⭐ Votes: ${story.vote}\n🔗 [Read Here](${story.link})\n🖼️ Thumbnail: ${story.thumbnail}`;
      }).join('\n\n');

      const message = `🔍 Wattpad Search Results for: "${searchQuery}"\n\n${formattedResults}`;

      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching Wattpad data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching Wattpad data." }, pageAccessToken);
    }
  }
};
