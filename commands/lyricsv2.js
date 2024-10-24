const axios = require("axios");

module.exports = {
  name: 'lyricsv2',
  description: 'search lyrics based on api',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(" ");

    if (!query) {
      return sendMessage(senderId, { text: "Missing song title for the lyrics command." }, pageAccessToken);
    }

    sendMessage(senderId, { text: "⌛ Fetching lyrics, please wait..." }, pageAccessToken);

    try {
      const apiUrl = `https://markdevs-last-api-as2j.onrender.com/search/lyrics?q=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const { lyrics, title, artist, image } = response.data.result;

      if (!lyrics || !title || !artist || !image) {
        return sendMessage(senderId, { text: "Lyrics not found for the given query." }, pageAccessToken);
      }

      const message = {
        text: `🎵 **Title:** ${title}\n👤 **Artist:** ${artist}\n\n📜 **Lyrics:**\n${lyrics}`,
        attachment: (await axios({ url: image, responseType: 'stream' })).data
      };

      sendMessage(senderId, message, pageAccessToken);
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      sendMessage(senderId, { text: "An error occurred while fetching the lyrics." }, pageAccessToken);
    }
  }
};
