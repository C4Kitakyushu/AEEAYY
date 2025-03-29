const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Helper function to split text into chunks
function chunkText(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'poetry',
  description: 'fetch a poem by title, author, or randomly.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ');

    if (!query) {
      return sendMessage(senderId, {
        text: '❌ Usage: provide a type and optionally a title or author\n\nExample: poetry title love\nExample: poetry author william\nExample: poetry random'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: '⌛ Searching for poems, please wait...'
    }, pageAccessToken);

    try {
      // Extract type and optional title/author
      const [type, ...rest] = args;
      const titleOrAuthor = rest.join(' ');

      // Validate type
      if (!['title', 'author', 'random'].includes(type.toLowerCase())) {
        return sendMessage(senderId, {
          text: '❌ Invalid type. Use one of the following:\n• title\n• author\n• random'
        }, pageAccessToken);
      }

      // API request
      const apiUrl = `https://jerome-web.gleeze.com/service/api/poetry?type=${encodeURIComponent(type)}${titleOrAuthor ? `&titleorauthor=${encodeURIComponent(titleOrAuthor)}` : ''}`;
      const response = await axios.get(apiUrl);

      // Parse API response
      const { data } = response.data;

      if (!data || data.length === 0) {
        return sendMessage(senderId, {
          text: `❌ No poems found for the query: **${titleOrAuthor}**.`
        }, pageAccessToken);
      }

      // Prepare response message for the first poem
      const poem = data[0];
      const poemText = poem.lines.join('\n');
      const chunks = chunkText(poemText, 500); // Chunk text into 500-character parts

      // Send poem details
      await sendMessage(senderId, {
        text: `📜Title: ${poem.title}\n🖋️Author: ${poem.author}\n\n📄Poem:`
      }, pageAccessToken);

      // Send chunks sequentially
      for (const chunk of chunks) {
        await sendMessage(senderId, {
          text: chunk
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❌ Error fetching poem:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while fetching the poem. Please try again later.'
      }, pageAccessToken);
    }
  }
};