const axios = require('axios');

module.exports = {
  name: 'bible',
  description: 'fetches a random bible verse.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: '⌛ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗯𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁..' }, pageAccessToken);

    try {
      const response = await axios.get('https://joshweb.click/bible');
      const verse = response.data.verse;
      const reference = response.data.reference;

      const message = {
        text: `📖 𝗛𝗲𝗿𝗲 𝘆𝗼𝘂𝗿 𝗿𝗮𝗻𝗱𝗼𝗺 𝗯𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲:\n\n*${verse}*\n\n— _${reference}_`,
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
