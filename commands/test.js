const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Fetch the latest news based on a query, including images.',
  author: 'Elevnnnx',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ').trim();

    if (!query) {
      return sendMessage(senderId, {
        text: '❌ Please provide a search query to fetch news. Example:\n\n**newsfetch Rodrigo Duterte**'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: `⌛ Fetching news for **${query}**, please wait...`
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://elevnnnx-rest-api.onrender.com/api/news?query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      const { status, articles } = response.data;

      if (status === 'success' && articles.length > 0) {
        // Prepare news details
        const newsMessages = articles
          .slice(0, 5) // Limit to 5 articles
          .map((article, index) => {
            const title = article.title || 'No title available';
            const author = article.author || 'Unknown Author';
            const source = article.source || 'Unknown Source';
            const time = article.time || 'Unknown time';
            const link = article.link || 'No link available';
            const imageUrl = article.imageUrl || null;

            return {
              text: `**${index + 1}. ${title}**\nAuthor: ${author}\nSource: ${source}\nTime: ${time}\n[Read more](${link})`,
              imageUrl,
            };
          });

        // Send messages for each news article
        for (const news of newsMessages) {
          await sendMessage(senderId, {
            text: news.text,
            attachment: news.imageUrl
              ? {
                  type: 'image',
                  payload: { url: news.imageUrl, is_reusable: true },
                }
              : undefined,
          }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, {
          text: '❌ No news articles found for your query. Please try again with a different keyword.'
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❌ Error fetching news:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while fetching news. Please try again later.'
      }, pageAccessToken);
    }
  }
};