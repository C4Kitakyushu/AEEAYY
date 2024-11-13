const axios = require('axios');

module.exports = {
  name: 'wattpad',
  description: 'search for stories on Wattpad.',
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

      if (!data.title) {
        return sendMessage(senderId, { text: `No stories found on Wattpad for the given query.` }, pageAccessToken);
      }

      const { title, author, description } = data;
      const message = `📖 Wattpad Story\n\n📝 Title: ${title}\n\n👤 Author: ${author}\n\n📄 Description: ${description}`;

      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching Wattpad data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching Wattpad data." }, pageAccessToken);
    }
  }
};
