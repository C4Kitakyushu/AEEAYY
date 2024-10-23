const axios = require("axios");

module.exports = {
  name: 'adobo',
  description: 'ask to adobo gpt',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let userInput = args.join(" ").trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝗿𝘆' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 𝗔𝗱𝗼𝗯𝗼 𝗚𝗣𝗧, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    // Delay for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    const apiUrl = `https://markdevs-last-api-2epw.onrender.com/api/adobo/gpt?query=${encodeURIComponent(userInput)}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const adoboResponse = response.data.result;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        const message = `🥘 𝗔𝗱𝗼𝗯𝗼 𝗚𝗣𝗧 🐔\n━━━━━━━━━━━━━━━\n${adoboResponse}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`;

        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        console.error('API response did not contain expected data:', response.data);
        sendMessage(senderId, { text: '❌ An error occurred while fetching the Adobo GPT response. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Adobo API:', error);
      sendMessage(senderId, { text: `❌ An error occurred while fetching the data. Error details: ${error.message}` }, pageAccessToken);
    }
  }
};
