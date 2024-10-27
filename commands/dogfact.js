const axios = require('axios');

module.exports = {
  name: 'dogfact',
  description: 'fetch a random dog fact!',
  author: 'developer', // Replace 'YourName' with the desired author name
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⚙ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗱𝗼𝗴 𝗳𝗮𝗰𝘁..." }, pageAccessToken);

    try {
      const response = await axios.get('https://c-v5.onrender.com/api/dogfact');
      const { fact } = response.data;

      if (!fact) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗱𝗼𝗴 𝗳𝗮𝗰𝘁." }, pageAccessToken);
      }

      sendMessage(senderId, { text: `🐶 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘁𝗵𝗲 𝗱𝗼𝗴 𝗳𝗮𝗰𝘁:\n\n${fact}` }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
