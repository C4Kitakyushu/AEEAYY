const axios = require('axios');

module.exports = {
  name: 'bible',
  description: 'fetches a random bible verse.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: '🙏 Fetching a random Bible verse, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get('https://joshweb.click/bible');
      const verse = response.data.verse;
      const reference = response.data.reference;

      const message = {
        text: `📖 Here is a random bible verse for you:\n\n*${verse}*\n\n— _${reference}_`,
        mentions: [
          {
            tag: `@${senderId}`,
            id: senderId
          }
        ]
      };

      sendMessage(senderId, message, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: 'An error occurred while fetching the Bible verse.' }, pageAccessToken);
    }
  }
};
