const axios = require('axios');

module.exports = {
  name: 'binle',
  description: 'fetch a random bible verse!',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "📖 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗕𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://ccprojectsjonellapis-production.up.railway.app/api/randomverse');
      const data = response.data;

      if (!data || !data.verse) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝘃𝗲𝗿𝘀𝗲." }, pageAccessToken);
      }

      const verse = data.verse;
      sendMessage(senderId, { text: `📜 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘁𝗵𝗲 𝗿𝗮𝗻𝗱𝗼𝗺 𝘃𝗲𝗿𝘀𝗲:\n\n${verse}` }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
