const axios = require('axios');

module.exports = {
  name: 'fact',
  description: 'fetches a random fact!',
  author: 'Ali',  // Replace 'Ali' with the desired author name
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Notify user that a fact is being fetched
    sendMessage(senderId, { text: "⚙ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗳𝗮𝗰𝘁..." }, pageAccessToken);

    try {
      // Make a request to fetch a random fact
      const response = await axios.get('https://jerome-web.onrender.com/service/api/random-facts');
      const { fact } = response.data;

      // Check if the fact is present in the response
      if (!fact) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗳𝗮𝗰𝘁." }, pageAccessToken);
      }

      // Send the fact to the user
      sendMessage(senderId, { text: `💡 𝗛𝗲𝗿𝗲 𝗶𝘀 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗳𝗮𝗰𝘁:\n\n${fact}` }, pageAccessToken);
    } catch (error) {
      // Log and notify of any errors
      console.error('Error fetching random fact:', error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
