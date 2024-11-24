const axios = require('axios');

module.exports = {
  name: 'chords',
  description: 'Search for song chords by title or artist.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, { text: "Please provide a song title or artist for chord search." }, pageAccessToken);
    }

    try {
      const apiUrl = `https://joshweb.click/search/chords?q=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data || !data.chords) {
        return sendMessage(senderId, { text: `No chords found for the song "${searchQuery}".` }, pageAccessToken);
      }

      const message = `🎸 Chords for "${searchQuery}":\n\n${data.chords}`;

      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching song chords:', error);
      sendMessage(senderId, { text: "An error occurred while fetching song chords." }, pageAccessToken);
    }
  }
};
