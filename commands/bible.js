const axios = require('axios');

module.exports = {
  name: 'bible',
  description: 'Fetch a Bible verse!',
  author: 'Dale Mekumi',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "📖 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗕𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://elevnnnx-rest-api.onrender.com/api/bibleverse', {
        params: {
          text: "Many are the plans in a person’s heart, but it is the Lord’s purpose that prevails. - Proverbs 19:21 (NIV)\n"
        }
      });

      const verse = response.data.verse || response.data;  // Handle different possible data structures

      if (!verse) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗕𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲." }, pageAccessToken);
      }

      sendMessage(senderId, { 
        text: `📜 𝗕𝗶𝗯𝗹𝗲 𝗩𝗲𝗿𝘀𝗲\n\n"${verse}"`
      }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};