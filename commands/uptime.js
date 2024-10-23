const moment = require('moment-timezone');

module.exports = {
  name: 'uptime',
  description: 'assistant uptime .',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days} 𝗗𝗮𝘆𝘀 ${hours} 𝗛𝗼𝘂𝗿𝘀 ${minutes} 𝗠𝗶𝗻𝘂𝘁𝗲𝘀 ${seconds} 𝗦𝗲𝗰𝗼𝗻𝗱𝘀;

    sendMessage(senderId, { text:` 𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗨𝗣𝗧𝗜𝗠𝗘🟢n\n\➜${uptimeString}` }, pageAccessToken);
  }
};