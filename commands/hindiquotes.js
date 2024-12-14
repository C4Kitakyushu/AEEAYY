const axios = require('axios');

module.exports = {
  name: 'quote',
  description: 'fetch a random hindi quote for inspiration!',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⚙ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗤𝘂𝗼𝘁𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://hindi-quotes.vercel.app/random');
      const data = response.data;

      if (!data || !data.quote) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗾𝘂𝗼𝘁𝗲." }, pageAccessToken);
      }

      const quote = data.quote;
      sendMessage(senderId, { text: `📝 𝗛𝗲𝗿𝗲 𝗶𝘀 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗛𝗶𝗻𝗱𝗶 𝗾𝘂𝗼𝘁𝗲:\n\n${quote}` }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
