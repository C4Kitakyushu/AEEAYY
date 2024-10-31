const axios = require('axios');

module.exports = {
  name: 'arxiv',
  description: 'search for articles on arxiv.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, { text: "Please provide a search query for Arxiv." }, pageAccessToken);
    }

    try {
      const apiUrl = `https://gpt4withcustommodel.onrender.com/arxiv?query=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.title) {
        return sendMessage(senderId, { text: `No research articles found on Arxiv for the given query.` }, pageAccessToken);
      }

      const { title, authors, published, summary } = data;
      const message = `📚 Arxiv Research Article\n\n📝 Title: ${title}\n\n👥 Authors: ${authors.join(', ')}\n\n🗓️ Published Date: ${published}\n\n📖 Summary: ${summary}`;
      
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching Arxiv data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching Arxiv data." }, pageAccessToken);
    }
  }
};
