const axios = require('axios');

module.exports = {
  name: 'joke',
  description: 'fetches a random joke.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⌛ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗿𝗮𝗻𝗱𝗼𝗺 𝗰𝗼𝗿𝗻𝘆 𝗷𝗼𝗸𝗲𝘀 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁..." }, pageAccessToken);

    try {
      const apiUrl = 'https://aryanchauhanapi2.onrender.com/api/joke';
      const response = await axios.get(apiUrl);
      const joke = response.data.joke;

      if (joke) {
        const message = ` 𝗛𝗲𝗿𝗲 𝘆𝗼𝘂𝗿 𝗿𝗮𝗻𝗱𝗼𝗺 𝗰𝗼𝗿𝗻𝘆 𝗷𝗼𝗸𝗲𝘀: \n\n${joke}`;
        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: "☹️ Sorry, I couldn't fetch a joke at the moment." }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching joke:', error);
      sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
    }
  }
};