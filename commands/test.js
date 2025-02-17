const axios = require("axios");

module.exports = {
  name: 'test',
  description: 'Ask Deepseek-V3 AI',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let userInput = args.join(" ").trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ Please provide your query.' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | Asking Deepseek-V3, please wait...' }, pageAccessToken);

    // Delay for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    const apiUrl = `https://markdevs-last-api-p2y6.onrender.com/Deepseek-V3?ask=${encodeURIComponent(userInput)}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const deepseekResponse = response.data.result;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        const message = `🤖 Deepseek-V3 AI\n━━━━━━━━━━━━━━━\n${deepseekResponse}\n━━━━━━━━━━━━━━━\n⏰ Response Time: ${responseTime}`;

        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        console.error('Unexpected API response:', response.data);
        sendMessage(senderId, { text: '❌ Error fetching Deepseek-V3 response. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      sendMessage(senderId, { text: `❌ An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};