const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'ask to ai',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let userInput = args.join(" ").trim();

    if (!userInput) {
      return sendMessage(senderId, { text: 'Usage: ai [your question]' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 𝗮𝗻 𝗮𝗻𝘀𝘄𝗲𝗿, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    // Delay for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    const gpt4_api = `https://personal-ai-phi.vercel.app/kshitiz?prompt=${encodeURIComponent(userInput)}&content=${encodeURIComponent("you are an AI assistant")}`;

    try {
      const response = await axios.get(gpt4_api);

      if (response.data && response.data.code === 2 && response.data.message === "success") {
        const generatedText = response.data.answer;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        // For simplicity, we're not fetching the user info in this structure, but if needed, you can implement it.
        const message = `𝗠𝗜𝗚𝗢 𝗔𝗦𝗦𝗜𝗦𝗧𝗔𝗡𝗧 🤖\n━━━━━━━━━━━━━━━\n${generatedText}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;


        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        console.error('API response did not contain expected data:', response.data);
        sendMessage(senderId, { text: '❌ An error occurred while generating the text response. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: `❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message}` }, pageAccessToken);
    }
  }
};