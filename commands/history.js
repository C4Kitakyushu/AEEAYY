const axios = require('axios');

module.exports = {
  name: 'history',
  description: 'search and know about historical events.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, { text: "⌛ 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗮𝗯𝗼𝘂𝘁 𝗵𝗶𝘀𝘁𝗼𝗿𝘆" }, pageAccessToken);
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