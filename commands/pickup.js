const axios = require('axios');

module.exports = {
  name: 'pickup',
  description: 'fetch a random pickup line for fun!',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⚙ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗽𝗶𝗰𝗸𝘂𝗽 𝗹𝗶𝗻𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://kaiz-apis.gleeze.com/api/pickuplines');
      const data = response.data;

      if (!data || !data.pickupLine) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗽𝗶𝗰𝗸𝘂𝗽 𝗹𝗶𝗻𝗲." }, pageAccessToken);
      }

      const pickupLine = data.pickupLine;
      sendMessage(senderId, { text: `💬 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘁𝗵𝗲 𝗽𝗶𝗰𝗸𝘂𝗽 𝗹𝗶𝗻𝗲:\n\n${pickupLine}` }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝗨𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
