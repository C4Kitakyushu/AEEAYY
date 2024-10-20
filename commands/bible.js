const axios = require('axios');

module.exports = {
  name: 'bibleVerse',
  description: 'fetches a random Bible verse.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⚙️ Fetching a Bible verse for you..." }, pageAccessToken);

    try {
      const apiUrl = 'https://rest-api.joshuaapostol.site/random-bible-verse';
      const response = await axios.get(apiUrl);
      const verse = response.data;

      if (verse) {
        const message = `📖 Here's a random Bible verse for you: \n\n "${verse.text}"\n\n- ${verse.book} ${verse.chapter}:${verse.verse}`;
        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: "☹️ Sorry, I couldn't fetch a Bible verse at the moment." }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
    }
  }
};
