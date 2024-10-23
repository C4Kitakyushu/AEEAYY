const axios = require('axios');

module.exports = {
  name: 'cohere',
  description: 'Ask Cohere AI',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let userInput = args.join(' ').trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝗿𝘆' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 𝗖𝗼𝗵𝗲𝗿𝗲 𝗔𝗜, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    // Delay for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    const apiUrl = `https://hiroshi-api.onrender.com/ai/cohere?ask=${encodeURIComponent(userInput)}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.answer) {
        const cohereResponse = response.data.answer;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        const message = `🤖 𝗖𝗼𝗵𝗲𝗿𝗲 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━\n${cohereResponse}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`;

        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        console.error('API response did not contain expected data:', response.data);
        sendMessage(senderId, { text: '❌ An error occurred while fetching the Cohere AI response. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Cohere API:', error);
      sendMessage(senderId, { text: `❌ An error occurred while fetching the data. Error details: ${error.message}` }, pageAccessToken);
    }
  }
};
