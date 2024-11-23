const axios = require('axios');

module.exports = {
  name: 'wattpad',
  description: 'Search and read Wattpad stories.',
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

      let message = `🔍 Wattpad Search Results for: "${searchQuery}"\n\n`;

      data.result.forEach((story, index) => {
        message += `📖 ${index + 1}. *${story.title}*\n`;
        message += `👤 Author: ${story.author || 'Unknown'}\n`;
        message += `👀 Reads: ${story.read} | ⭐ Votes: ${story.vote}\n`;
        message += `🔗 [Read Here](${story.link})\n`;
        message += `🖼️ Thumbnail: ${story.thumbnail}\n\n`;
      });

      message += `📖 Use: \`wattpad read [story number] [chapter number]\` to read a specific chapter.`;

      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching Wattpad data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching Wattpad data." }, pageAccessToken);
    }
  }
};
