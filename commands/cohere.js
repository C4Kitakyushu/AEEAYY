const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');
const MAX_MESSAGE_LENGTH = 2000;

module.exports = {
  name: 'cohere',
  description: 'interact with cohere ai',
  author: 'developer',
  usage: 'cohere [question/message]',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const input = (args.join(' ') || 'hello').trim();

    try {
      const response = await axios.get(`https://hiroshi-api.onrender.com/ai/cohere?ask=${encodeURIComponent(input)}`);

try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.answer) {
        const cohereResponse = response.data.answer;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

      const data = response.data;
      const responseText = data.response || 'No response available.';
      const formattedMessage = `❄️ 𝗖𝗼𝗵𝗲𝗿𝗲 𝗔𝗜 🤖\n━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`;

      // Truncate the message if it exceeds the maximum allowed length
      const truncatedMessage = formattedMessage.substring(0, MAX_MESSAGE_LENGTH);

      await sendMessage(senderId, { text: truncatedMessage }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Unexpected error.' }, pageAccessToken);
    }
  }
};