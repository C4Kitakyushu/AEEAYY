const axios = require('axios');

module.exports = {
  name: 'chords',
  description: 'Search and get information about chords.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, { text: "⌛ Please provide a chord or song name to search for." }, pageAccessToken);
    }

    try {
      const apiUrl = `https://markdevs-last-api-2epw.onrender.com/search/chords?q=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.chords) {
        const chords = response.data.chords;

        let message = `Chords for "${searchQuery}":\n\n`;
        chords.forEach((chord, index) => {
          message += `${index + 1}. ${chord.name} - ${chord.details}\n`;
        });

        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `No chords found for "${searchQuery}".` }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching chord information:', error);
      sendMessage(senderId, { text: "An error occurred while searching for chords." }, pageAccessToken);
    }
  }
};
