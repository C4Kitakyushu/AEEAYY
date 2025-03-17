const axios = require('axios');

module.exports = {
  name: 'te',
  description: 'Fetch an anime quote!',
  author: 'Dale Mekumi',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "🎬 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮𝗻 𝗮𝗻𝗶𝗺𝗲 𝗾𝘂𝗼𝘁𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://elevnnnx-rest-api.onrender.com/api/animequotes', {
        params: {
          character: "Mikasa Ackerman",
          quote: "If we’re going to die anyway, then let’s die fighting!"
        }
      });

      const { character, quote } = response.data;

      if (!character || !quote) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮𝗻 𝗮𝗻𝗶𝗺𝗲 𝗾𝘂𝗼𝘁𝗲." }, pageAccessToken);
      }

      sendMessage(senderId, {
        text: `🗡️ 𝗔𝗻𝗶𝗺𝗲 𝗤𝘂𝗼𝘁𝗲\n\n🗨️ "${quote}"\n👤 - ${character}`
      }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};