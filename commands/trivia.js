const axios = require('axios');

module.exports = {
  name: 'trivia',
  description: 'fetches a random trivia question.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⌛ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗿𝗮𝗻𝗱𝗼𝗺 𝘁𝗿𝗶𝘃𝗶𝗮 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁..." }, pageAccessToken);

    try {
      const apiUrl = 'https://jerome-web.onrender.com/service/api/trivia';
      const response = await axios.get(apiUrl);
      const trivia = response.data.trivia;

      if (trivia) {
        const message = `🤔 𝗛𝗲𝗿𝗲'𝘀 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝘁𝗿𝗶𝘃𝗶𝗮 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻: \n\n❓ ${trivia.question}\n\n💡 Answer: ${trivia.answer}`;
        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: "☹️ Sorry, I couldn't fetch a trivia question at the moment." }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching trivia:', error);
      sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
    }
  }
};
