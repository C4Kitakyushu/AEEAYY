const axios = require("axios");

module.exports = {
  name: 'test',
  description: 'Ask Deepseek-V3 AI',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let userInput = args.join(" ").trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝗿𝘆' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | 𝗔𝘀𝗸𝗶𝗻𝗴 𝗗𝗲𝗲𝗽𝘀𝗲𝗲𝗸-𝗩𝟯, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    // Delay for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    const apiUrl = `https://markdevs-last-api-p2y6.onrender.com/Deepseek-V3?ask=${encodeURIComponent(userInput)}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const deepseekResponse = response.data.result;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        const message = `🤖 𝗗𝗲𝗲𝗽𝘀𝗲𝗲𝗸-𝗩𝟯 𝗔𝗜\n━━━━━━━━━━━━━━━\n${deepseekResponse}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`;

        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        console.error('API response did not contain expected data:', response.data);
        sendMessage(senderId, { text: '❌ An error occurred while fetching the Deepseek-V3 response. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      sendMessage(senderId, { text: `❌ An error occurred while fetching the data. Error details: ${error.message}` }, pageAccessToken);
    }
  }
};