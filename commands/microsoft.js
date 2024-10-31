const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'microgen',
  description: 'generate microsoft account ',
  usage: 'microgen <name>',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const nameInput = args[0];

    if (!nameInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮𝗻𝘆 𝗻𝗮𝗺𝗲.' }, pageAccessToken);
    }

    const apiUrl = `https://joshweb.click/api/genmicro?name=${encodeURIComponent(nameInput)}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.status) {
        return sendMessage(senderId, { text: '❌ Error generating account. Please try again.' }, pageAccessToken);
      }

      const email = `📧 𝗘𝗺𝗮𝗶𝗹: ${data.result.email}`;
      const password = `🛡️ 𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱: ${data.result.password}`;

      sendMessage(senderId, { text: `${email}\n${password}` }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: '❌ Error fetching data. Please try again.' }, pageAccessToken);
    }
  },
};
