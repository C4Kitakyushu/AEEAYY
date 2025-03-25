const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Fetch article details from the arXiv API based on a query.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ');

    if (!query) {
      return sendMessage(senderId, {
        text: '❌ Please provide a search query. Example:\n\n**arxiv love**'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: '⌛ Searching for articles, please wait...'
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://jerome-web.gleeze.com/service/api/arxiv?query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      // Parse API response
      const { query_info, article } = response.data;

      if (!article) {
        return sendMessage(senderId, {
          text: `❌ No articles found for the query: **${query}**.`
        }, pageAccessToken);
      }

      // Prepare response message
      const message = `
**Title:** ${article.title}
**Authors:** ${article.authors.join(', ')}
**Published:** ${article.published}
**Summary:** ${article.summary}
**Link:** ${article.id}
      `;

      await sendMessage(senderId, {
        text: message
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error fetching article:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while fetching the article. Please try again later.'
      }, pageAccessToken);
    }
  }
};