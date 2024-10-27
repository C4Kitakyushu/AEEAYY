const axios = require('axios');

module.exports = {
  name: 'motivation',
  description: 'fetch a random motivation quote!',
  author: 'developer', // Replace 'YourName' with the desired author name
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⚙ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗺𝗼𝘁𝗶𝘃𝗮𝘁𝗶𝗼𝗻 𝗾𝘂𝗼𝘁𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://c-v5.onrender.com/api/motivation');
      const { motivation } = response.data;

      if (!motivation) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗺𝗼𝘁𝗶𝘃𝗮𝘁𝗶𝗼𝗻 𝗾𝘂𝗼𝘁𝗲." }, pageAccessToken);
      }

      sendMessage(senderId, { text: `💡 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘁𝗵𝗲 𝗺𝗼𝘁𝗶𝘃𝗮𝘁𝗶𝗼𝗻:\n\n${motivation}` }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
