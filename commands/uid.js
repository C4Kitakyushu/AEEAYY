const axios = require('axios');

module.exports = {
  name: 'uid',
  description: 'retrieve your uid',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "🔍 𝗥𝗲𝘁𝗿𝗶𝗲𝘃𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗨𝗜𝗗..." }, pageAccessToken);

    try {
      // Since there is no external request to fetch data, we'll directly send the UID
      await sendMessage(senderId, { text: `${senderId}` }, pageAccessToken);
    } catch (error) {
      console.error('Error sending UID:', error);
      sendMessage(senderId, { text: '❌ 𝗘𝗿𝗿𝗼𝗿: 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝘆𝗼𝘂𝗿 𝗨𝗜𝗗.' }, pageAccessToken);
    }
  }
};
