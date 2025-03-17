const axios = require('axios');

module.exports = {
  name: 'testing',
  description: 'Fetch a random Bible verse!',
  author: 'CH4IRMANNN',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⚙ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗕𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲..." }, pageAccessToken);

    const params = {
      book: args[0] || '',       // Specify book if provided (e.g., "Proverbs")
      chapter: args[1] || '',    // Specify chapter if provided
      verse: args[2] || ''       // Specify verse if provided
    };

    try {
      const response = await axios.get('https://elevnnnx-rest-api.onrender.com/api/bibleverse', { params });
      const { verse } = response.data;

      if (!verse) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗕𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲." }, pageAccessToken);
      }

      sendMessage(senderId, { text: `📖 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘁𝗵𝗲 𝗕𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲:\n\n${verse}` }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};