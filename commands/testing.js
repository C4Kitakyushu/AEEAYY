const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Fetch a random pickup line!',
  author: 'Dale Mekumi',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "💬 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗽𝗶𝗰𝗸𝘂𝗽 𝗹𝗶𝗻𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://kaiz-apis.gleeze.com/api/pickuplines');

      const pickupLine = response.data.message || response.data; // Handle possible data structure variations

      if (!pickupLine) {
        return sendMessage(senderId, { text: "😔 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗽𝗶𝗰𝗸𝘂𝗽 𝗹𝗶𝗻𝗲." }, pageAccessToken);
      }

      sendMessage(senderId, { 
        text: `💖 𝗣𝗶𝗰𝗸𝘂𝗽 𝗟𝗶𝗻𝗲\n\n"${pickupLine}"`
      }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};